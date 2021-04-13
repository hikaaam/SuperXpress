import * as Crypto from "crypto-js";

export const hash = (plaintext: string): string => {
  return Crypto.SHA256(plaintext).toString();
};
