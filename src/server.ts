import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import * as dotenv from "dotenv";

import userRouter from "./routes/user";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
// アクセスログ
app.use(morgan("dev"));

// クライアントから送信されたHTTPリクエストのボディ内に含まれるURLエンコードされたデータ（例えば、フォームから送信されたデータ）を解析
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Running API" });
});

app.get("error", (req: Request, res: Response, next: NextFunction) => {
  throw new Error("Error!");
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running! http://localhost:${PORT}`);
});

function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err.stack);
  res.status(500).send("何か問題が発生しました!");
}
