import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import { getUserByEmail } from "../controllers/user_controller";

// Headerの Key : authorization, Value : Bearer [token]
export const authCheck = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "認証トークンが提供されていません。" });
  }

  try {
    const decoded = verify(token, "SECRET_KEY");
    console.log("aaa", decoded);
    next();
  } catch (error) {
    res.status(401).json({ message: "無効なトークンです。" });
  }
};
