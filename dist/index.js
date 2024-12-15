"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app = (0, express_1.default)();
const db_1 = require("./db");
const db_2 = require("./db");
const middleware_1 = require("./middleware");
require('dotenv').config();
(0, db_2.connectMongoDb)();
app.use(express_1.default.json());
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    try {
        yield db_1.UserModel.create({
            username: username,
            password: password
        });
        res.status(200).json({
            message: "User signred up"
        });
    }
    catch (e) {
        res.status(411).json({
            message: ` User already exists`
        });
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    // lot of check still left
    // username and password string 
    // check user in the database
    try {
        const response = yield db_1.UserModel.findOne({
            username,
            password
        });
        console.log(response);
        console.log(" user exists ");
        // if user found 
        if (response) {
            const token = jsonwebtoken_1.default.sign({ id: response._id }, process.env.JWT_SECRET);
            console.log(token);
            res.appendHeader("Authorization", token).status(200).json({
                message: "signed in",
                token: token
            });
        }
        else {
            throw new Error("User not found");
        }
    }
    catch (e) {
        res.status(404).json({
            message: "User not exists"
        });
    }
}));
app.post("/api/v1/content", middleware_1.userMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const link = req.body.link;
    const title = req.body.title;
    const _id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    console.log(_id);
    try {
        const tagsRes = yield db_1.TagsModel.find({ userId: _id });
        console.log(tagsRes);
        if (tagsRes) {
            const content = yield db_1.ContentModel.create({ userId: _id, title: title, tags: tagsRes, link: link });
            if (content)
                res.status(202).json({ message: "Content created" });
            else {
                throw new Error("Content not created");
            }
        }
        else
            throw new Error(" Tags not working");
    }
    catch (error) {
        if (error instanceof Error)
            res.status(411).json({ message: error.message });
    }
}));
app.get("/api/v1/content", (req, res) => {
});
app.delete("/api/v1/content", (req, res) => {
});
// creation of tags
app.post("/api/v1/tags", middleware_1.userMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const hash = req.body.hash;
    const tag = req.body.tag;
    const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        if (id) {
            const tagRes = yield db_1.TagsModel.create({
                hash,
                tag,
                userId: id
            });
            if (tagRes) {
                res.status(201).json({ message: " tag created" });
            }
            else
                throw new Error(" tag not created");
        }
    }
    catch (error) {
        if (error instanceof Error)
            res.status(404).json({ message: error.message });
    }
}));
app.post("/api/v1/brain/share", (req, res) => {
});
app.get("/api/v1/brain/share", (req, res) => {
});
app.listen(3000, () => {
    console.log(" server started");
});
