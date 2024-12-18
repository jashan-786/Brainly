import express from  "express"

import jwt from "jsonwebtoken"
const app= express();
import  {UserModel , TagsModel , ContentModel, LinksModel} from  "./db"
import { connectMongoDb } from "./db";
import { UserType } from "./interfaces";
import { userMiddleWare } from "./middleware";
import { random } from "./utils";
import cors from "cors"
require('dotenv').config()

connectMongoDb();

app.use(express.json())
app.use(cors())

app.post("/api/v1/signup", async ( req, res) => {
const username= req.body.username
const password= req.body.password
console.log( " added")
    try{
    await UserModel.create({
        username : username,
        password: password

    })

    res.status(200).json( {

        message : "User signred up"
    })
}
catch(e) {
    res.status(411).json({
        message: ` User already exists`


    })

}
})


app.post("/api/v1/signin", async (req, res) =>  {

    const username=req.body.username;
    const password=req.body.password;
    // lot of check still left
    // username and password string 

    // check user in the database
     try{

       const response=  await UserModel.findOne( {
            username , 
            password
        })
        console.log(response)
        console.log(" user exists ")
        // if user found 
       if(response ){
        const token= jwt.sign({id: response._id} , process.env.JWT_SECRET as string )

        console.log(token)
        
         res.appendHeader("Authorization", token ).status(200).json({
            message: "signed in",
            token: token
        })
    }else{
        throw new Error("User not found")
    }
     }
     catch(e){

        res.status(404).json( {

             message: "User not exists"
        })
     }
})
// add content
app.post("/api/v1/content", userMiddleWare , async (req, res  ) => {
    const link= req.body.link;
    const title=req.body.title;
   

     const _id= req.user?.id
     console.log(_id)
     try {
    const tagsRes  = await TagsModel.find({ userId : _id })
    console.log(tagsRes)


    if(tagsRes)
    {
     const content= await ContentModel.create({userId : _id, title:  title, tags: tagsRes, link: link  })

     if( content)
        res.status(202).json( {message : "Content created"})
    else
    {
        throw new Error("Content not created")
    }
    }
    else
    throw new Error( " Tags not working")
     }
     catch( error)
     {
        if ( error instanceof Error)
            res.status(411).json( { message :  error.message})

     }

})

// get content 
// what i want to add user name not id 
// let say we add authors too
// got user but I dont want the password just the name 
// how reference s help
app.get("/api/v1/content", userMiddleWare , async (req, res ) => {

        const resultQuery=  await ContentModel.find( { userId : req.user?.id}).populate("userId", "username")

        try{
            if(resultQuery)
            {
              res.status(200).json( { content : resultQuery})
            }
            else
            {

                throw new Error( "No content ")
            }

        }
        catch ( e){
            if (e instanceof Error)
            res.status(404).json( { message : e.message})
            

        }
    

    
})



// get content about particular id 

app.get("/api/v1/content/:id", userMiddleWare , async (req, res ) => {

    const resultQuery=  await ContentModel.find( { userId : req.user?.id ,_id : req.params.id }).populate("userId")

    try{
        if(resultQuery)
        {
          res.status(200).json( { content : resultQuery})
        }
        else
        {

            throw new Error( "No content under this id")
        }

    }
    catch ( e){
        if (e instanceof Error)
        res.status(404).json( { message : e.message})
        

    }

})

// to delete the content
app.delete("/api/v1/content", async (req, res ) => {

    const contentId= req.body.contentId
    const resultQuery=  await ContentModel.deleteOne( { userId : req.user?.id , _id: contentId})

    try{
        if(resultQuery)
        {
          res.status(200).json( { content : resultQuery})
        }
        else
        {

            throw new Error( "No content under this id")
        }

    }
    catch ( e){
        if (e instanceof Error)
        res.status(404).json( { message : e.message})
        

    }


    
})


// creation of tags
app.post("/api/v1/tags", userMiddleWare,  async (req, res ) => {
    const hash= req.body.hash
    const tag =req.body.tag
    const id= req.user?.id
    try {
if( id){
   const tagRes =await TagsModel.create({
        hash ,
        tag ,
        userId: id
    })

    if( tagRes){

        res.status(201).json( {message  : " tag created"})
    }else

    throw new Error(" tag not created")


}

    }
    catch ( error){
        if ( error instanceof Error) 
        res.status(404).json( {  message : error.message})

    }

})


app.post("/api/v1/brain/share", userMiddleWare,async (req, res ) => {
const share = req.body.share

if(share)
{

    const hash= random(10)

    const exists=  await LinksModel.findOne({
        userId: req.user?.id
     })

     if(exists)
       { res.json({ message: "/share/" + exists.hash})
    return;
    }
    

   await   LinksModel.create({
            userId: req.user?.id,
            hash

     })


     res.json({ message: "/share/" + hash})
}else{

   await  LinksModel.deleteOne({
userId: req.user?.id

    })

    res.json({ message: "Link sharable option set to " + share})

}  



})


//brainly/share/asdddwef(hash)
app.get("/api/v1/brain/:shareLink", async (req, res ) => {

    const hash= req.params.shareLink

   const link= await LinksModel.findOne({hash})

   console.log(link)
   if(!link){

 
    res.status(411).json({
        message:"Sorry incorrect input"
   })        


   return;
    }

    //1st oprion to get username
    const content= await  ContentModel.find({ userId: link.userId}).populate("userId" , "username")

//2nd oprton to get useranmae
    const user= await UserModel.findOne( { _id : link.userId})


    if(!user)
    {
        res.status(411).json({

            message: "user not found"
        })

        return;
    }

    

    res.status(200).json({
            userName: user.username,
            content :content

    })

})



app.listen(3000, () => {
    console.log( " server started")


})