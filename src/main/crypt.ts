import crypto from "crypto";

import { v4 as uuidv4 } from "uuid";

function encryptString(string: string) {

  const algorithm = "aes-256-ccm";
  const key = crypto.scryptSync(uuidv4(), "salt", 24);
  const iv = Buffer.alloc(16, 0);

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  cipher.update(string);
  const encrypted = cipher.final("utf-8");

  return { encrypted, key, iv }

}

function decryptString(encryptedData: string, iv: crypto.BinaryLike | null, key: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>) {
  const algorithm = "aes-256-ccm";
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(key),
    iv
  );
  decipher.update(encryptedData, "utf-8");
  const decrypted = decipher.final("utf-8");

  return decrypted;

}

export { encryptString, decryptString };
