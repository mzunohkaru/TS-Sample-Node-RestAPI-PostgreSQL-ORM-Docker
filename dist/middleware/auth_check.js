"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authCheck = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
// Headerの Key : authorization, Value : Bearer [token]
const authCheck = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        return res
            .status(401)
            .json({ message: "認証トークンが提供されていません。" });
    }
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, "SECRET_KEY");
        console.log("aaa", decoded);
        next();
    }
    catch (error) {
        res.status(401).json({ message: "無効なトークンです。" });
    }
};
exports.authCheck = authCheck;
