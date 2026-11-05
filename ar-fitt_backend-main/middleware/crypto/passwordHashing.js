// Salted PBKDF2 password/OTP hashing via Web Crypto (crypto.subtle), replacing
// both the unsalted SHA-1 scheme used throughout usecases/user/* and the bcrypt
// native addon used by admin login — neither runs on Cloudflare Workers.
//
// The hash is stored as a single self-describing string so no schema/column
// change is needed on `user_credential.password_hash` / `user_otp.otp_hash`:
//   pbkdf2-sha512$<iterations>$<saltHex>$<hashHex>

const ALGORITHM = "pbkdf2-sha512";
const ITERATIONS = 210_000;
const SALT_BYTES = 16;
const KEY_LENGTH_BITS = 512;

function toHex(bytes) {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function fromHex(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

async function deriveBits(password, salt, iterations) {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const derived = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: "SHA-512" },
    keyMaterial,
    KEY_LENGTH_BITS
  );
  return new Uint8Array(derived);
}

export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const derived = await deriveBits(password, salt, ITERATIONS);
  return `${ALGORITHM}$${ITERATIONS}$${toHex(salt)}$${toHex(derived)}`;
}

export async function verifyPassword(password, storedHash) {
  if (!storedHash) return false;
  const parts = storedHash.split("$");
  if (parts.length !== 4 || parts[0] !== ALGORITHM) return false;

  const [, iterationsStr, saltHex, hashHex] = parts;
  const iterations = parseInt(iterationsStr, 10);
  const salt = fromHex(saltHex);
  const expected = fromHex(hashHex);
  const actual = await deriveBits(password, salt, iterations);

  if (actual.length !== expected.length) return false;
  // constant-time compare
  let diff = 0;
  for (let i = 0; i < actual.length; i++) {
    diff |= actual[i] ^ expected[i];
  }
  return diff === 0;
}
