import { Router } from "express";

import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user_controller";
import { authCheck } from "../middleware/auth_check";

const router = Router();

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/name/:id", authCheck, updateUser);
router.delete("/:id", authCheck, deleteUser);

export default router;
