import {type Request,type Response} from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.ts"
export async function loginController(req:Request,res:Response){
           const data=req.body;
           if(!data){
            return res.status().json({
                message:"Undefined data"
            })
           }
           const user=await User.findOne({
            email:data.email
           })
           if(!user){
            return res.status().json({
                message:"There exist no user that has the same email "
            })
           }
           try{
            //Using Argon
            // if (await argon2.verify("<big long hash>", "password"))
               const match=await bcrypt.compare(data.password,user.password)
             if(match){
               const token=jwt.sign({userId:User._id},process.env.JWT_SECRET!,{expiresIn:"10000h"})
               return res.status().json({
                message:"User Authenticated Successfully",
                token:token,//or token, only will work
               })
            }

           }
}