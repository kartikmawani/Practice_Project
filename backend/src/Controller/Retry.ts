import {type Request,type Response} from "express";
import {z} from "zod"
const PayloadSchema=z.object({
    User:z.string().min(3,"Minimum 3 letter"),
    CacheData:z.string().min(5,"Minimum 5 letter")
})
type payload=z.infer<typeof PayloadSchema>
async function retryFetch(Check:PayloadSchema){

}
export  async function Retry(req:Request,res:Response){
    try{
        let Check
        const data=req.body;
        try{
        Check=PayloadSchema.safeParse(data)
        }
        catch(error){
            if(error instanceof z.ZodError){
                 return res.status(400).json({
                    message:"Please enter valid Credentials",
                    error:error
                 })
            }
        }
        let result
        let attempt=0;
        while(attempt<5 &&!result.success){
            result=await retryFetch(Check)
             attempt=attempt+1;

        }
        return res.status(200).json({
            message:"Api result is fetched",
            result:result
        })
    }
    catch(error){

    }
}