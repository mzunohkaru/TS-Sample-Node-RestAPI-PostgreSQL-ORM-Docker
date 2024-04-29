"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserByEmail = exports.getUserById = exports.getUsers = exports.createUser = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("../db"));
const user_1 = require("../models/user");
const hash_controller_1 = require("../controllers/hash_controller");
dotenv_1.default.config();
const createUser = async (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const hashedPassword = await (0, hash_controller_1.hashPassword)(password);
    try {
        // DataSourceよりRepository取得
        const repo = db_1.default.getRepository(user_1.User);
        // Create
        const newUser = repo.create({
            name: name,
            email: email,
            password: hashedPassword,
        });
        const persisted = await repo.save(newUser);
        // JWTトークンを発行
        const token = (0, jsonwebtoken_1.sign)({ email: persisted.email }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res
            .status(201)
            .json({
            message: "データの作成に成功しました",
            user: persisted,
            token: token,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "データベースへの挿入中にエラーが発生しました。" });
    }
};
exports.createUser = createUser;
const getUsers = async (req, res, next) => {
    try {
        // DataSourceからRepositoryを取得
        const repo = db_1.default.getRepository(user_1.User);
        // 全ユーザーのデータを取得
        const users = await repo.find();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: "データの取得中にエラーが発生しました。" });
    }
};
exports.getUsers = getUsers;
const getUserById = async (req, res, next) => {
    try {
        // DataSourceよりRepository取得
        const repo = db_1.default.getRepository(user_1.User);
        // Read
        const foundById = await repo.findOneBy({
            id: Number(req.params.id),
        });
        res.status(200).json({ user: foundById });
    }
    catch (error) {
        res.status(500).json({ message: "データの取得中にエラーが発生しました。" });
    }
};
exports.getUserById = getUserById;
const getUserByEmail = async (req, res, next) => {
    const email = req.body.email;
    try {
        const repo = db_1.default.getRepository(user_1.User);
        const foundByEmail = await repo.findOneBy({ email: email });
        res.status(200).json({ user: foundByEmail });
    }
    catch (error) {
        res.status(500).json({ message: "Emailでのユーザー取得中にエラーが発生しました。" });
    }
};
exports.getUserByEmail = getUserByEmail;
const updateUser = async (req, res, next) => {
    try {
        // DataSource
        const repo = db_1.default.getRepository(user_1.User);
        // Update
        const updated = await repo.update(req.params.id, { name: req.body.name });
        res.status(200).json({ message: "データの更新に成功しました。" });
    }
    catch (error) {
        res.status(500).json({ message: "データの更新中にエラーが発生しました。" });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res, next) => {
    try {
        // DataSource
        const repo = db_1.default.getRepository(user_1.User);
        // Delete
        const deleted = await repo.delete(req.params.id);
        res.status(200).json({ message: "データの削除に成功しました。" });
    }
    catch (error) {
        res.status(500).json({ message: "データの削除中にエラーが発生しました。" });
    }
};
exports.deleteUser = deleteUser;
