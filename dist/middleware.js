"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleWare = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userMiddleWare = (req, res, next) => {
    console.log(" hit middleware");
    try {
        // check presense of authoriztion header
        if (req.headers["authorization"]) {
            const athz = req.headers["authorization"];
            if (athz != null) {
                const token = athz.substring(7);
                const checkToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                console.log(checkToken);
                if (checkToken) {
                    console.log(checkToken);
                    //@ts-ignore
                    req.user = { id: checkToken.id };
                    next();
                }
                else {
                    throw new jsonwebtoken_1.default.JsonWebTokenError("Token error");
                }
            }
            else {
                throw new Error("Authorization token not present");
            }
        }
        else {
            console.log(" error thro ");
            throw new Error("Authorization header not present");
        }
    }
    catch (error) {
        if (error instanceof Error)
            res.status(404).json({
                message: error.message
            });
    }
};
exports.userMiddleWare = userMiddleWare;
