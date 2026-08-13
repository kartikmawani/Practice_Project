import {type Request,type Response,type NextFunction} from "express";
import jwt from "jsonwebtoken";

export function Authentication(req:Request,res:Response,next:NextFunction){
    try{
    const token=req.header('Authorization')?.split(''[1]);
     if(!token){
        console.log("Token is not available");
     }
     const decode=jwt.verify(token,process.env.JWT_SECRET);
     req.user=decode;
     //Request interface does not inherently have user  field so to add it we will extend request and 
     //add user field  in express.d.ts
     next();
    }
    catch(err){
        console.error(err);
    }
}