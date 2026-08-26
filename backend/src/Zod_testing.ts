import z from "zod";
import {type Request,type Response} from "express";
import axios from "axios";
//Use of safe parse here
export const DIDI=z.object({
    PatientName:z.string(),
    Probable_Diagnose:z.string().description("Never say u are diagnosed with this,just tell them they have symptoms"),
    Suggestions:z.string().description("Suggest suitable available option "),

})
 
export type DidiPayload=z.infer<typeof Didi>;

export function validateResponse(rawInput:unknown):{
    data:DidiPayload;
}{
   const result=DidiSchema.safeParse(rawInput);       
}
 export async function Formatted_Output(req:Request,res:Response){ 
 
try{
        const data=req.body;
          const response=await axios.get(`http://example.com/${data.name}`)
            
              try{
           const structured_output=DIDI.parse(response.data);  
           return res.status(200).json({
            message:"Data is acc.to requiremnet",
            structured_output,
           })  
                 }
            catch(error){
                if(error instanceof z.ZodError){
                    return res.status(500).json({
                        message:"Data is not structured"
                    })
                }
            }
              
}
 catch(error){
    return res.status(400).json({
        message:"NOt able to perform suitable operation"
    })
 }
}