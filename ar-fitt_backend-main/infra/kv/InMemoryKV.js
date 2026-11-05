// Drop-in replacement for a Cloudflare KV namespace binding, backed by an
// in-memory Map — used when running on a plain VPS instead of Workers as a
// single persistent Node process. Matches just the subset of the KVNamespace
// interface AdminAuthMiddleware.js calls (get/put/delete/list with TTL and
// prefix/cursor paging), so that file needed zero changes to run here.
//
// Sessions are lost on process restart — acceptable for admin sessions (same
// as the original Express app's in-memory Map this replaces).
export class InMemoryKV {
  constructor() {
    this.store = new Map(); // key -> { value: string, expiresAt: number|null }
  }

  async get(key) {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  async put(key, value, options = {}) {
    const expiresAt = options.expirationTtl ? Date.now() + options.expirationTtl * 1000 : null;
    this.store.set(key, { value, expiresAt });
  }

  async delete(key) {
    this.store.delete(key);
  }

  // Always returns everything in one page (list_complete: true, no cursor) —
  // session counts are small enough that real pagination isn't needed.
  async list(options = {}) {
    const prefix = options.prefix || "";
    const now = Date.now();
    const keys = [];
    for (const [key, entry] of this.store) {
      if (entry.expiresAt && now > entry.expiresAt) {
        this.store.delete(key);
        continue;
      }
      if (key.startsWith(prefix)) keys.push({ name: key });
    }
    return { keys, list_complete: true, cursor: undefined };
  }
}
