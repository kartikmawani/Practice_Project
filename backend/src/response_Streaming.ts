import {streamtext} from 'ai';
import   {type Request,type Response} from "node.js"

const map=new Map()

const z_Interface=z.object({
    response:z.string();
})
 const objectResponse=interface{
      response:string,
      model:string,
      message:string
}
const CallObject interface{
    remainingRequest:number,
    totalRequest:number
}
//res.setHeader('Content-type','text/event-stream);
export async function Streamnig(req:Request,res:Response):Promise<objectResponse>{
        const query=req.body;
        const user=req.params.id
        if(!query||query.length==0){
            res.status(400).json({
                  message:"Please fill the field before clicking the button"
            })
        }
        const prompt=`You are an Instructor for general population .
                      You have to answer the ${query}  in simple words.
                       Be firm with the user.`
            const CallObject=slidingWindow(user)
        const {textStream}= await streamtext({
             model:"gemini-2.5-flash",
             output:output.object({
                response:z_Interface.string()
             }),
             temperature:0.4,
             prompt:prompt,

        })
        for(const stream of streamtext){
                res.write(`data:JSON.stringify(${stream})`)
        }

}
//It may be string or number need to check ts.

export function slidingWindow(user:string):CallObject{
           const time=Date.now();
           
}