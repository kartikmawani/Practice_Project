import express from "express"
import {type Request,type Response} from "express"
const app=express()
app.use(express.json())
import Repo from "../models/repoScan.models.js"


async function Acceptor(repoUrl:string,language:string) {
      if(!repoUrl || !language){
        throw new Error("fefa")
      }
    await Repo.findOneAndUpdate({
        repoUrl:repoUrl
    },
    {
      $inc:{ScanCount:1},
     $push:{scanDates:Date.now()}
    },{
        upsert:true
    }
      )
}

app.get("/api/metrics",async(req:Request,res:Response)=>{
    //aggregate uses array 
     await Repo.aggregate([
           {$match:{scanCount:{$gt:5}}},
           {$group:{
            _id:'$language',
             scanSum:{$sum:'$scanCount'}
           }},

     ])

})