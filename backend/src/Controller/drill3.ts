import express from "express"
import {type Request,type Response,type NextFunction} from "express"
import z from "zod"

const app=express();
app.use(express.json())
 

const  payloadValidation=z.object({
    playerId:z.string(),
    score:z.number(),
    timeStamp:z.string()
}) 
export function Controller(req:Request,res:Response,next:NextFunction){

    const data=req.body;
    
    try{
        payloadValidation.parse(data)
        res.status(202).json({
            message:"Data is Accpeted"
        })
        setTimeout(()=>console.log("Score saved after 3 second"),3000)
    }
    catch(error){
         next(error)

    }
 }
 export function MiddlewareFunction(err:any,req:Request,res:Response,next:NextFunction){
         let  error=err.message||"Internal server error"
         let statusCode=500;
         if(err.name==="ZodError"){
              statusCode=400
              error=err.errors
         }
         res.status(statusCode).json({
            success:false,
            message:error
         })
 }
app.post("/api/scores",Controller)
 app.use(MiddlewareFunction)
app.listen(3333,()=>{
    console.log("Server is listening on port 3333");
})

 