"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user_controller");
const auth_check_1 = require("../middleware/auth_check");
const router = (0, express_1.Router)();
router.post("/", user_controller_1.createUser);
router.get("/", user_controller_1.getUsers);
router.get("/:id", user_controller_1.getUserById);
router.put("/name/:id", auth_check_1.authCheck, user_controller_1.updateUser);
router.delete("/:id", auth_check_1.authCheck, user_controller_1.deleteUser);
exports.default = router;
