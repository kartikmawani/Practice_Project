import {type Request,type Response} from "express"
import "User" from "PRobable schema"
export interface dataShape{
    jobType:string,
    payload:{
        repoUrl:string
    }
}
export async  function microservice1(req:Request,res:Response):Promise<>{
    const data:dataShape =req.body;
    const userId=req.userid
    if(!data){
        return res.status(400).json({
            message:"please insert the creadentials properly"
        })
    }
    await User.findOneAndUpdate({
        userId
    },
      status:"Queued",
      leadName:data.name,
      leadmail:data.mail
         )
    res.status(202).json({
        message:"Server recieved the credentials",
        status:"Queued"
    })
    setTimeout(()=>{
         console.log("Job Queued")
    },3000) 

}

 