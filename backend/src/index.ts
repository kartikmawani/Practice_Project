import {MCPTool,MCPServer} from "mcp-framework";
import {z} from "zod"
import axios from "axios" 
const InputSchema=z.object({
     
  founderName:z.string().describe("Give me founder name"),
  founderEmail:z.string().describe("Email of the founder"),
  founderDescription:z.string().describe("Give the founder description")
})
interface StreamFinalOutput{
  founderChitha:string
}

class StreamTool extends MCPTool<StreamFinalOutput>{
  name="StreamTool";
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
  async execute({founderName,founderEmail,founderDescription}:any){
      try{
          //have to use openAi here
      const output:any=await axios.get(`https://aiefjhap.com/${founderName}/${founderEmail}/${founderDescription}`,{
          //http stream should have fetch 
          headers:{
              "Content-type":"Application/json",
              responseType: 'stream'
          }
      })
       for await(const chunk of output){
          chunk
          if(!chunk){
              
          }
       }
  }
      catch(error:any){
          throw new Error(`Failed to fetch repo data: ${error.message}`)
      }
  }
}
export class ToolCalling{
 protected mcp:MCPServer;
 constructor(){
   this.mcp=new MCPServer({
      transport: {
          type: "http-stream",
          options: {
            port: 3000,
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
   })
   this.registerTools();
 }
 private registerTools():void{
      this.mcp.registerTool(new StreamTool())
 }
 async run():Promise<void>{
  try{
      await this.mcp.start()
  }
  catch(error){
      console.error(
          "Fatal Error in MCP Server:",
          error instanceof Error ? error.message : error
        );
  }
 }
}
export const MCP=new ToolCalling()
MCP.run();
