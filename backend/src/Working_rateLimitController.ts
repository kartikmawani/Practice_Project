import { type Request, type Response } from "express";
import pLimit from "p-limit";
import axios from "axios";

// 1. Initialize concurrency limiter (max 3 concurrent jobs across the app)
const limit = pLimit(3);

export interface UserData {
  content: string;
  mail: string;
}

// 2. Individual Task with Dedicated Timeout & Abort Signal
async function executeAsyncTask(taskData: UserData): Promise<void> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second hard ceiling

  try {
    const response = await axios.post(
      `https://api.example.com/dispatch`,
      {
        recipient: taskData.mail,
        message: taskData.content,
      },
      {
        headers: { "Content-Type": "application/json" },
        signal: controller.signal, // Attaches per-request abort signal
      }
    );

    console.log(`Task completed successfully for: ${taskData.mail} (Status: ${response.status})`);
  } catch (err: any) {
    if (err.name === "CanceledError" || axios.isCancel(err)) {
      console.error(`Task timed out (>5000ms) for: ${taskData.mail}`);
    } else {
      console.error(`Task execution failed for ${taskData.mail}:`, err.message);
    }
  } finally {
    clearTimeout(timeoutId); // Critical: Prevents Node.js timer memory leaks
  }
}

// 3. Express Route Handler (Non-Blocking Ingress)
export const rateLimitController = (req: Request, res: Response) => {
  const data: UserData = req.body;

  // Validation Guard: Catch bad payloads immediately
  if (!data?.content || !data?.mail) {
    return res.status(400).json({
      error: "Validation failed: 'content' and 'mail' are required fields.",
    });
  }

  // Step 1: Immediate acknowledgment in < 15ms
  res.status(202).json({
    status: "ACCEPTED",
    message: "Request queued for background execution.",
  });

  // Step 2: Fire-and-forget background task into the bounded concurrency pool
  limit(async () => {
    await executeAsyncTask(data);
  });
};


import {type Request,type Response} from "express";
import pLimit from "p-limit";
import axios from "axios"

const limit=pLimit(3)
export interface UserData{
    content:string,
    mail:string
}
async function runtask(value){
    const controller=new AbortController();
    const timer=setTimeout(() => {
        controller.abort()
    },500);
   try{const reponse=await axios.get(`https://random.com/${value}`,{
    headers: { "Content-Type": "application/json" },
    signal: controller.signal, // Attaches per-request abort signal
  })
}
  
}
export const main=async(req:Request,res:Response)=>{
  const data:UserData=req.body;
  if(!data.content||!data.mail){
    return res.status(400).json({
        message:"Data can not be null or undefined"
    })
    
  }
  else{ 
          res.status(202).json({
          message:"Data has been accepted"
          })
      }
   limit(async()=>{
    await runtask(data)
   })
}