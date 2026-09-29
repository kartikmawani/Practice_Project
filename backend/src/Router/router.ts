import  express from "express";
import {type Request,type Response} from "express"
export const router=express.Router({caseSensitive:true,strict:true})
//post is recommended for both as  login is saving credentials too
router.post('/login',Authentication,loginController);
router.post('/reqister',RegisterController);
router.post('/task',Authentication,rateLimitController)
router.post('/jobs',Authentication,microservie1)
router.get('/stream',async(req:Request,res:Response)=>{
    try{
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Transfer-Encoding', 'chunked');
        
         
    }
    catch(error:any){
        console.log("stream error: ", error);
        res.status(500).send(error.message);
      }
    finally{
        
        res.end();
        console.log('Stream closed');
    }
})