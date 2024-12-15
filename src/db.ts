import mongoose from "mongoose";

// schema - structure 


const Schema= mongoose.Schema;
const objectId= Schema.ObjectId;
const User= new Schema({
    username: { type: String, unique: true},
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
    userId:  { type : Schema.Types.ObjectId , ref: "UserModel", required: true},
    tags: [ { type : Schema.Types.ObjectId, ref: "TagsModel", required: true } ]

})

const Tags= new Schema({
hash: String,
tag: String,
userId : { type: Schema.Types.ObjectId , ref: "UserModel", required: true}
})


const UserModel= mongoose.model('Users', User)
const ContentModel= mongoose.model('Content', Content)
const TagsModel= mongoose.model('Tags',Tags);

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

export {UserModel , ContentModel, TagsModel}