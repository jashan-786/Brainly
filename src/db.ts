import mongoose from "mongoose";

// schema - structure 


const Schema= mongoose.Schema;
const objectId= Schema.ObjectId;
const User= new Schema({
    username: { type: String,   unique: true},
    password: String

})

enum ContentType {
'YtLink' ,
'NotionLink',
'ArticleLink'

}
const Content= new Schema(
    
    {
    title: {type : String, required: true},
    link: String,
    userId:  { type : mongoose.Types.ObjectId , ref: "User", required: true},
    tags: [ { type : mongoose.Types.ObjectId, ref: "Tags", required: true } ]

})

const Tags= new Schema({
hash: String,
tag: String,
userId : { type: mongoose.Types.ObjectId , ref: "User", required: true}
})


const Links= new Schema({
hash: String,
userId: {type: mongoose.Types.ObjectId , ref : "User" , required: true , unique : true}

})

const UserModel= mongoose.model('Users', User)
const ContentModel= mongoose.model('Content', Content)
const TagsModel= mongoose.model('Tags',Tags);
const LinksModel= mongoose.model('Links',Links)
// connection to mongodb 

export const connectMongoDb= () => {
    console.log(process.env.MONGO_USERNAME )
    console.log(process.env.MONGO_PASSWORD)

    
mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.xuole.mongodb.net/Brainly`
).then(
() => console.log( 'connected to databse ')


).catch( () => {

    console.log('error connecting to database ')
})


}

export {UserModel , ContentModel, TagsModel, LinksModel}