export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const rawPassword = encoder.encode(password);

  // generate random salt
  const salt = crypto.getRandomValues(new Uint8Array(16));

  // secret
  const key = await crypto.subtle.importKey(
    "raw-secret",
    rawPassword,
    "Argon2id",
    false,
    ["deriveBits"],
  );

  // derived salt + password hash
  const derived = await crypto.subtle.deriveBits(
    {
      name: "Argon2id",
      //@ts-ignore - library interface is buggy
      memory: 65536,
      passes: 3,
      parallelism: 4,
      nonce: salt,
    },
    key,
    256, // output length in bits
  );

  const base64Salt = salt.toBase64();

  const passwordHash = new Uint8Array(derived);
  const base64PasswordHash = passwordHash.toBase64();

  // simplified; only returns salt+hash
  return `${base64Salt}$${base64PasswordHash}`;
}

export async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  const rawPassword = new TextEncoder().encode(password);
  const [base64Salt, base64PasswordHash] = storedHash.split("$");

  const storedSalt = Uint8Array.fromBase64(base64Salt);

  const key = await crypto.subtle.importKey(
    "raw-secret",
    rawPassword,
    "Argon2id",
    false,
    ["deriveBits"],
  );

  const derived = await crypto.subtle.deriveBits(
    {
      name: "Argon2id",
      //@ts-ignore - library interface is buggy
      memory: 65536,
      passes: 3,
      parallelism: 4,
      nonce: storedSalt,
    },
    key,
    256, // output length in bits
  );

  const passwordHash = new Uint8Array(derived).toBase64();

  return (passwordHash === base64PasswordHash) ? true : false;
}
