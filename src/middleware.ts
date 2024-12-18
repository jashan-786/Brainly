import { Express, NextFunction , Request, Response } from "express"
import jwt, { JwtPayload }  from "jsonwebtoken";
export const userMiddleWare= (req: Request,res: Response, next: NextFunction) =>{

    console.log( " hit middleware")
    try{
        // check presense of authoriztion header
    if(req.headers["Authorization"]){
    const athz=  req.headers["Authorization"]
    
    if(athz != null){
      const token = (athz as string).substring(7);
   
     const checkToken = jwt.verify(token as string, process.env.JWT_SECRET as string)
     console.log(checkToken)
        if(checkToken ){
            console.log(checkToken)
       
     
        if(typeof checkToken === "string")
        {

            throw new Error("Token is a string not an object")
        }
     req.user={ id : (checkToken as JwtPayload).id}
          next()

        }
        else{

            throw new jwt.JsonWebTokenError("Token error")
        }

    }else{
        throw new Error("Authorization token not present")

    }
    
}
    else{
        console.log( " error thro ")
        throw new Error("Authorization header not present")
    }}
    catch( error ){

        if( error instanceof Error)
        res.status(404).json({

            message:   error.message
        })


    }
}