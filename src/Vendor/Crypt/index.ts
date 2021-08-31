import * as Crypto from 'crypto-js';

export const hash = (plaintext: string): string => {
    return Crypto.SHA256(plaintext).toString();
};

export const encrypt = (plaintext: string, key: string): string => {
    return Crypto.AES.encrypt(plaintext, key, {
        mode: Crypto.mode.ECB
    }).toString();
};

export const decrypt = (encrypted: string, key: string): string => {
    return Crypto.AES.decrypt(encrypted, key, {
        mode: Crypto.mode.ECB
    }).toString(Crypto.enc.Utf8);
};

export default {
    hash,
    encrypt,
    decrypt
}