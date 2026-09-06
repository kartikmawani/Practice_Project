import {type Request,type Response} from "express"
import {MCPTool,MCPServer} from "mcp-framework";
import {z} from "zod"
import axios from "axios"

interface StreamFinalOutput{
    founderName:string,
    founderEmail:string,
    founderDescription:string
}
const OutputSchema=z.object({
    founderName:z.string(),
    founderEmail:z.email(),
    founderDescription:z.string()
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
        async execute({founderName,founderEmail,founderDescription}){
            const output=await axios.get("Url",{
                headers:{
                    "Content-type":"Application/json"
                }
            })
            return output
        }
}

export async function httpStreamTool(req:Request,res:Response):Promise<StreamFinalOutput>{
      const data:StreamFinalOutput=req.body;

      const server = new MCPServer({
        transport: {
          type: "http-stream",
          options: {
            port: 1337,
            responseMode: "stream",
            //maxMessageSize: "4mb",
            cors: {
              allowOrigin: "*",
              allowMethods: "GET, POST, DELETE, OPTIONS", // Access-Control-Allow-Methods
              allowHeaders: "Content-Type, Accept, Authorization, x-api-key, Mcp-Session-Id, Last-Event-ID", // Access-Control-Allow-Headers
              exposeHeaders: "Content-Type, Authorization, x-api-key, Mcp-Session-Id"
            },
          //   resumability: {
          //     enabled: false,               // Enable stream resumability (default: false)
          //     historyDuration: 300000       // How long to keep message history in ms (default: 300000 - 5 minutes)
          //   }
          }
        }
      });
      
      const finalOutput=server.start();
      res.

}