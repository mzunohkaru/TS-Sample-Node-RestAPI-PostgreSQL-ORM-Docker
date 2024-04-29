import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

import { User } from "./models/user";

dotenv.config();

// PostgreSQLへの接続設定
const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "db",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER || "user",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_DATABASE || "dev",
  synchronize: false, // DBとのスキーマ同期(true: 開発用)
  dropSchema: false, // スキーマ削除(true: 開発用)
  logging: true, // SQLログ
  entities: [User], // 使用するEntity
  migrations: [],
  subscribers: [],
});

AppDataSource.initialize()
  .then(async(ds) => {
    console.log("データソースが初期化されました。");
    // await ds.destroy(); // 接続を切る
  })
  .catch((error) => {
    console.error("データソースの初期化エラー:", error);
  });

export default AppDataSource;
