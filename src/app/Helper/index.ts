import * as Crypto from "crypto-js";

export const hash = (plaintext: string): string => {
  return Crypto.SHA256(plaintext).toString();
};

export const encrypt = (plaintext: string, key: string): string => {
  return Crypto.AES.encrypt(plaintext, key).toString();
};

export const decrypt = (encrypted: string, key: string): string => {
  return Crypto.AES.decrypt(encrypted, key).toString(Crypto.enc.Utf8);
};
