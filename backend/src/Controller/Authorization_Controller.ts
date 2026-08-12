import {type Request,type Response} from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model.ts"
export async function ReqisterController(req:Request,res:Response){
        const data=req.body;
        if(!data.password||!data.username||!data.email){
            return res.status().json({
                message:"Invalid Credentials"
            })
        }
        try{
            //we can use Argon2id as well Tradeoff argon2 algo is comparatively new has more set up but gives greater
            //Security then bcrypt
            //import Argon2id and cosnt hash=await argon2.hash(password)      
             const saltRounds=8;
            const hash=bcrypt.hashSync(data.password,saltRounds); 
            // Use this method when you want to store the data in the database after making some changes in it  
            // const user=new User({
            //     username:data.user,
            //     password:data.password,
            //     email:data.email
            // })
            // await user.save()
        //Creates the document and save it in the database directly
        await User.create({
            username:data.user,
            password:hash,
            email:data.email
        })
        return res.status(200).json({
            message:"User is registered",
            
        })
    }
    catch(error){
        res.status(400).json("Not able to save to data in the databse")
    }

}