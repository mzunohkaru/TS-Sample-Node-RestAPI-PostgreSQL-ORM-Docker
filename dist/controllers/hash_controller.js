"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPassword = exports.hashPassword = void 0;
const crypto_1 = __importDefault(require("crypto"));
const hashPassword = async (password) => {
    const salt = crypto_1.default.randomBytes(16).toString("hex");
    const iterations = 10000;
    const keylen = 64;
    const digest = "sha512";
    try {
        const hashedPassword = crypto_1.default
            .pbkdf2Sync(password, salt, iterations, keylen, digest)
            .toString("hex");
        return `${salt}$${iterations}$${keylen}$${digest}$${hashedPassword}`;
    }
    catch (error) {
        throw new Error("パスワードのハッシュ化に失敗しました。");
    }
};
exports.hashPassword = hashPassword;
const verifyPassword = async (inputPassword, storedHash) => {
    const [salt, storedIterations, keylen, digest, hash] = storedHash.split("$");
    try {
        const inputHash = crypto_1.default
            .pbkdf2Sync(inputPassword, salt, parseInt(storedIterations), parseInt(keylen), digest)
            .toString("hex");
        return inputHash === hash;
    }
    catch (error) {
        throw new Error("パスワードの検証に失敗しました。");
    }
};
exports.verifyPassword = verifyPassword;
