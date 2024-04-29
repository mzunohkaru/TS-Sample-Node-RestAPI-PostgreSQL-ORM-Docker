import { Request, Response, NextFunction } from "express";
import { sign } from "jsonwebtoken";
import dotenv from "dotenv";

import AppDataSource from "../db";
import { User } from "../models/user";
import { hashPassword, verifyPassword } from "../controllers/hash_controller";

dotenv.config();

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = await hashPassword(password);

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction(); // トランザクションの開始

  try {
    // DataSourceよりRepository取得
    const repo = queryRunner.manager.getRepository(User);

    // Create
    const newUser = repo.create({
      name: name,
      email: email,
      password: hashedPassword,
    });
    const persisted = await repo.save(newUser);

    // JWTトークンを発行
    const token = sign({ email: persisted.email }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    await queryRunner.commitTransaction(); // トランザクションのコミット

    res.status(201).json({
      message: "データの作成に成功しました",
      user: persisted,
      token: token,
    });
  } catch (error) {
    await queryRunner.rollbackTransaction(); // トランザクションのロールバック
    res
      .status(500)
      .json({ message: "データベースへの挿入中にエラーが発生しました。" });
  } finally {
    await queryRunner.release(); // リソースの解放
  }
};

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // DataSourceからRepositoryを取得
    const repo = AppDataSource.getRepository(User);
    // 全ユーザーのデータを取得
    const users = await repo.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "データの取得中にエラーが発生しました。" });
  }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // DataSourceよりRepository取得
    const repo = AppDataSource.getRepository(User);
    // Read
    const foundById = await repo.findOneBy({
      id: Number(req.params.id),
    });
    res.status(200).json({ user: foundById });
  } catch (error) {
    res.status(500).json({ message: "データの取得中にエラーが発生しました。" });
  }
};

const getUserByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req.body.email;
  try {
    const repo = AppDataSource.getRepository(User);
    const foundByEmail = await repo.findOneBy({ email: email });
    res.status(200).json({ user: foundByEmail });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Emailでのユーザー取得中にエラーが発生しました。" });
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const repo = queryRunner.manager.getRepository(User);
    const updated = await repo.update(req.params.id, { name: req.body.name });
    await queryRunner.commitTransaction();
    res.status(200).json({ message: "データの更新に成功しました。" });
  } catch (error) {
    await queryRunner.rollbackTransaction();
    res.status(500).json({ message: "データの更新中にエラーが発生しました。" });
  } finally {
    await queryRunner.release();
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await AppDataSource.transaction(async (transactionalEntityManager) => {
      const repo = transactionalEntityManager.getRepository(User);
      const deleted = await repo.delete(req.params.id);
      if (deleted.affected === 1) {
        res.status(201).json({ message: "ユーザーの削除に成功しました。" });
      } else {
        throw new Error("ユーザーが見つかりませんでした。");
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "ユーザーの削除中にエラーが発生しました。" });
  }
};

export {
  createUser,
  getUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
};
