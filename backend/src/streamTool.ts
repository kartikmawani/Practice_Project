import {type Request,type Response} from "express"
import {MCPTool,MCPServer} from "mcp-framework";
import {z} from "zod"
import axios from "axios"

interface StreamFinalOutput{
     founderChitha:string
}
interface InputData{
     
    founderName:string,
    founderEmail:string,
    founderDescription:string 
}
const InputSchema=z.object({
     
    founderName:z.string().describe("Give me founder name"),
    founderEmail:z.string().describe("Email of the founder"),
    founderDescription:z.string().describe("Give the founder description")
})
class StreamTool extends MCPTool<StreamFinalOutput>{
        name="StreamTolol";
        description="A tool for streaming data to the client";
        schema={
            founderName:{
                type:z.string(),
                description:"founder Name"
            },
            founderEmail:{
                type:z.string(),
                description:"founder Email"
            },
            founderDescription:{
                type:z.string(),
                description:"founder Description"
            }
        }
        async execute(founderName:string,founderEmail:string,founderDescription:string){
            try{
                //have to use openAi here
            const output=await axios.get(`https://aiefjhap.com/${founderName}/${founderEmail}/${founderDescription}`,{
                //http stream should have fetch 
                headers:{
                    "Content-type":"Application/json"
                }
            })
            if(!output){
                throw new Error("Api Error")
            }
             
        }
            catch(error:any){
                throw new Error(`Failed to fetch repo data: ${error.message}`)
            }
        }
}

export async function httpStreamTool(req:Request,res:Response):Promise<StreamFinalOutput>{
      const data:InputData=req.body;
       res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Transfer-Encoding', 'chunked');
       try{
         const StreamOutput=new StreamTool()
       const streamed=await StreamOutput.execute(data.founderName,data.founderEmail,data.founderDescription)
       res.write(streamed)
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