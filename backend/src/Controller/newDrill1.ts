import express from "express";
import {type Request,type Response }from "express"
import User from "../models/user.model"
import md5 from "md5"

const app=express();
app.use(express.json());

async function dataManager(req:Request,res:Response){
    //Get does not have a body so we use params
    const data=req.params 
    try{
    if(!data.email||!data.password){
        return res.status(400).json({
            message:"Please Enter and password as intended"
        })
}
        //find is a query builder so we use the object syntax
         const userData=await User.find({email:data.email}).select("username email").lean()
          // if !user is a best practive as well
        const String=JSON.stringify(userData)
        const hashedString=md5(String)
        if(res.headers["If-None-Match"]===hashedString){
            return res.status(304).send()
        
        }
        res.setHeader("Etag",hashedString)
        return res.status(200).json({
            message:"Data has been modified"
        })
    }
    catch(error:any){
        return res.status(500).json({
            message:"Internal server error",
            error:error.message
        })
    }
}
app.get("/api/leads",dataManager)
app.listen(3000,()=>{
    console.log(`Server is listening on port 3000`)
})