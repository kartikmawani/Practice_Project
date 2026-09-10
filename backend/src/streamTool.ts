import {type Request,type Response} from "express"
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
const client = new Client({ name: 'my-client', version: '1.0.0' });
const transport = new StreamableHTTPClientTransport(new URL('http://localhost:3000/mcp'));
await client.connect(transport);
import {z} from "zod"
 
import {MCP} from "./index.js"
 
const InputSchema=z.object({
    founderName:z.string().min(3,"Atleast 3 letter long"),
    founderEmail:z.email(),
    founderDescription:z.string().min(4,"Description should be 4 words long")
})
type UserData=z.infer<typeof InputSchema>
 
 
export async function httpStreamTool(req:Request,res:Response):Promise<StreamFinalOutput>{
      const data=req.body;
        
       try{
          const dataIsStructured=InputSchema.safeParse(data);
          if(!dataIsStructured.success){
            return res.status(400).json({
                message:"Send data as described"
            })
          }
          res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Transfer-Encoding', 'chunked');
          const result=await  client.callTool({
            name:"StreamTool",
            arguments:data
          })
       res.write(JSON.stringify(result))
       }
       catch(error:any){
        console.log("stream error: ", error);
        res.status(500).send(error.message);
      }
    finally{
        res.end();
        console.log('Stream closed');
    }
}