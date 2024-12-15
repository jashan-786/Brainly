"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagsModel = exports.ContentModel = exports.UserModel = exports.connectMongoDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// schema - structure 
const Schema = mongoose_1.default.Schema;
const objectId = Schema.ObjectId;
const User = new Schema({
    username: { type: String, unique: true },
    password: String
});
var ContentType;
(function (ContentType) {
    ContentType[ContentType["YtLink"] = 0] = "YtLink";
    ContentType[ContentType["NotionLink"] = 1] = "NotionLink";
    ContentType[ContentType["ArticleLink"] = 2] = "ArticleLink";
})(ContentType || (ContentType = {}));
const Content = new Schema({
    title: { type: String, required: true },
    link: String,
    userId: { type: Schema.Types.ObjectId, ref: "UserModel", required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "TagsModel" }]
});
const Tags = new Schema({
    hash: String,
    tag: String,
    userId: { type: Schema.Types.ObjectId, ref: "UserModel", required: true }
});
const UserModel = mongoose_1.default.model('Users', User);
exports.UserModel = UserModel;
const ContentModel = mongoose_1.default.model('Content', Content);
exports.ContentModel = ContentModel;
const TagsModel = mongoose_1.default.model('Tags', Tags);
exports.TagsModel = TagsModel;
// connection to mongodb 
const connectMongoDb = () => {
    console.log(process.env.MONGO_USERNAME);
    console.log(process.env.MONGO_PASSWORD);
    mongoose_1.default.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.xuole.mongodb.net/Brainly`).then(() => console.log('connected to databse ')).catch(() => {
        console.log('error connecting to database ');
    });
};
exports.connectMongoDb = connectMongoDb;
