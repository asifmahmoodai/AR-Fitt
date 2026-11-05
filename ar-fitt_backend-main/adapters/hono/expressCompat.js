// Wraps Hono's fetch-based Context into the Express-shaped (req, res, next) API
// that every existing controller/use-case/middleware method already speaks, so
// only each controller's route-registration method needs to change — not its
// business logic.
//
// A fresh controller instance (repositories -> use cases -> controller) is built
// per request via `buildController(appContext)`, because the Prisma client itself
// must be constructed per request on Workers (see infra/db/prismaClient.js).
//
// Chain semantics deliberately mirror real Express: `next()` is fire-and-forget
// (never awaited by the dispatcher), and the response is only finalized when a
// terminal `res` method (send/json/end/sendStatus) is actually called — however
// deep in the async chain that happens. Do NOT switch this to "await each
// handler, then read res state": most middleware here calls `next()` as a bare
// statement (not `return next()`), and awaiting the chain top-down would resolve
// before an async handler further down (e.g. one that awaits a DB call) finishes,
// producing a premature empty response.

function buildReq(c) {
  const url = new URL(c.req.url);
  const query = {};
  for (const [key, value] of url.searchParams) query[key] = value;

  const headers = {};
  c.req.raw.headers.forEach((value, key) => {
    headers[key] = value;
  });

  return {
    headers,
    query,
    params: c.req.param(),
    body: undefined,
    ip: c.req.header("cf-connecting-ip") || "",
    raw: c.req.raw,
  };
}

async function ensureBody(req, c) {
  if (req.body !== undefined) return req.body;
  const contentType = req.headers["content-type"] || "";
  try {
    if (contentType.includes("application/json")) {
      req.body = await c.req.json();
    } else if (contentType.includes("multipart/form-data")) {
      req.body = await c.req.parseBody();
    } else {
      req.body = {};
    }
  } catch {
    req.body = {};
  }
  return req.body;
}

function buildRes(resolve) {
  const state = { status: 200, headers: {}, body: undefined };
  let settled = false;

  function finish() {
    if (settled) return;
    settled = true;
    resolve(new Response(state.body ?? null, { status: state.status, headers: state.headers }));
  }

  const res = {
    status(code) {
      state.status = code;
      return res;
    },
    set(name, value) {
      state.headers[name] = value;
      return res;
    },
    setHeader(name, value) {
      state.headers[name] = value;
      return res;
    },
    json(obj) {
      if (!state.headers["Content-Type"]) state.headers["Content-Type"] = "application/json";
      state.body = JSON.stringify(obj);
      finish();
      return res;
    },
    send(data) {
      state.body = typeof data === "string" ? data : JSON.stringify(data);
      finish();
      return res;
    },
    sendStatus(code) {
      state.status = code;
      state.body = "";
      finish();
      return res;
    },
    writeHead(code, headers) {
      state.status = code;
      Object.assign(state.headers, headers || {});
      return res;
    },
    end(data) {
      if (data !== undefined) state.body = data;
      finish();
      return res;
    },
    get _sent() {
      return settled;
    },
  };
  return res;
}

function runChain(handlers, req, res) {
  let index = 0;
  function next(err) {
    if (err) {
      console.error("error in middleware chain:", err);
      if (!res._sent) {
        res.status(500).json({ message: "Internal server error", messageCode: "internal_server_error" });
      }
      return;
    }
    if (res._sent) return;
    const handler = handlers[index++];
    if (!handler) return;
    try {
      const result = handler(req, res, next);
      if (result && typeof result.then === "function") {
        result.catch((error) => next(error));
      }
    } catch (error) {
      next(error);
    }
  }
  next();
}

const BODY_METHODS = new Set(["post", "put", "patch", "delete"]);

// buildController: (appContext) => controller instance (rebuilt per request)
// each handler in the chain has signature (controller, req, res, next)
export function mountExpressController(app, buildController) {
  const router = {};
  for (const method of ["get", "post", "put", "delete", "patch"]) {
    router[method] = (path, ...args) => {
      const skipBodyParse = typeof args[0] === "object" && args[0] !== null && !Array.isArray(args[0]);
      const options = skipBodyParse ? args[0] : {};
      const handlers = skipBodyParse ? args.slice(1) : args;

      app[method](path, (c) => {
        return new Promise(async (resolve) => {
          const appContext = c.get("appContext");
          const controller = buildController(appContext);
          const req = buildReq(c);

          if (BODY_METHODS.has(method) && !options.skipBodyParse) {
            await ensureBody(req, c);
          }

          const res = buildRes(resolve);
          try {
            runChain(
              handlers.map((h) => (rq, rs, nx) => h(controller, rq, rs, nx)),
              req,
              res
            );
          } catch (error) {
            console.error(`unhandled error in ${method.toUpperCase()} ${path}:`, error);
            if (!res._sent) {
              res.status(500).json({ message: "Internal server error", messageCode: "internal_server_error" });
            }
          }
        });
      });
      return router;
    };
  }
  return router;
}
