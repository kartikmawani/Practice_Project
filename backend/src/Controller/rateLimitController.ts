import {type Request,type Response} from "express";
import pLimit from "p-limit";
import axios from "axios"
const limit=pLimit(3);

const controller=new AbortController();
 
export interface UserData{
     content:string,
     mail:string
}

export const rateLimitController=async(req:Request,res:Response)=>{
       const data:UserData=req.body;
       //const {content,mail}=req.body had to verify this syntax from gemini
       //Validate payload
       if(!data.content||!data.mail){
          return res.status(400).json({
            message:"Data can not be null or undefined"

          })
           
       } 
       else{
        //Sus abt 204(Data recieved but server is not returning anything delibrately) can we use it  here 
        res.status(202).json({
            message:"Data is accepted"
        })
        //202 helps to reduce latecny and make the req-res cycle complete under<15ms
      }
       async function runTask(Value){
        const response=await axios.get(`htttps:efiaejfpai/${Value}`,{
            headers:{
                  'Content-Type': 'application/json',
                   etag:'required file name'
            
            },
            signal:controller.signal
            
    
           }) 
           return response;
       }
       
       const Mapped_Result:UserData[]=[];
       Mapped_Result.push(data)
       const tasks=[];
       for(const Map of Mapped_Result){
         tasks.push(limit(()=>runTask(Map))
       }
       await Promise.all(tasks)
       console.log("P-limit implementation is complete")
    } 