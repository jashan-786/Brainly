import { Express, NextFunction , Request, Response } from "express"
import jwt  from "jsonwebtoken";
export const userMiddleWare= (req: Request,res: Response, next: NextFunction) =>{

    console.log( " hit middleware")
    try{
        // check presense of authoriztion header
    if(req.headers["authorization"]){
    const athz=  req.headers["authorization"]
    
    if(athz != null){
      const token = athz.substring(7);
   
     const checkToken = jwt.verify(token as string, process.env.JWT_SECRET as string)
     console.log(checkToken)
        if(checkToken ){
            console.log(checkToken)
       
     //@ts-ignore
  
     req.user={ id : checkToken.id}
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