"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const user_1 = require("../models/user");
const withUserRepository = async (req, res, next) => {
    try {
        req.repo = db_1.default.getRepository(user_1.User);
        next();
    }
    catch (error) {
        res.status(500).json({ message: "リポジトリの取得に失敗しました。" });
    }
};
