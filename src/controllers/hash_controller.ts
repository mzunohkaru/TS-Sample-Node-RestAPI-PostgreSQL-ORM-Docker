import crypt from "crypto";

const hashPassword = async (password: string): Promise<string> => {
  const salt = crypt.randomBytes(16).toString("hex");
  const iterations = 10000;
  const keylen = 64;
  const digest = "sha512";
  try {
    const hashedPassword = crypt
      .pbkdf2Sync(password, salt, iterations, keylen, digest)
      .toString("hex");
    return `${salt}$${iterations}$${keylen}$${digest}$${hashedPassword}`;
  } catch (error) {
    throw new Error("パスワードのハッシュ化に失敗しました。");
  }
};

const verifyPassword = async (
  inputPassword: string,
  storedHash: string
): Promise<boolean> => {
  const [salt, storedIterations, keylen, digest, hash] = storedHash.split("$");
  try {
    const inputHash = crypt
      .pbkdf2Sync(
        inputPassword,
        salt,
        parseInt(storedIterations),
        parseInt(keylen),
        digest
      )
      .toString("hex");
    return inputHash === hash;
  } catch (error) {
    throw new Error("パスワードの検証に失敗しました。");
  }
};

export { hashPassword, verifyPassword };

