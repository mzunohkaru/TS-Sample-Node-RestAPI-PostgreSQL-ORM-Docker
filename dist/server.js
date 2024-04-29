"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv = __importStar(require("dotenv"));
const user_1 = __importDefault(require("./routes/user"));
dotenv.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
// アクセスログ
app.use((0, morgan_1.default)("dev"));
// クライアントから送信されたHTTPリクエストのボディ内に含まれるURLエンコードされたデータ（例えば、フォームから送信されたデータ）を解析
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/user", user_1.default);
app.get("/", (req, res, next) => {
    res.json({ message: "Running API" });
});
app.get("error", (req, res, next) => {
    throw new Error("Error!");
});
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running! http://localhost:${PORT}`);
});
function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send("何か問題が発生しました!");
}
