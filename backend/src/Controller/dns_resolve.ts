import dns from "dns";
 
export async function Bounce_Catching(email_id){
    const email_name=email_id.split('.');
    if(email_name[1]!=="com"&&email_name[1]!=="io"&&email_name[1]!=="ai"){
             return new Error("Email id is not following top level domain name")
    }
    try{
         //have to revise  database operation in both sql,nosql 
    const emailDomain=email_name.split("@")[1];
    const result=await dns.promises.resolveMx(emailDomain);
     if(!result||result.length==0){
        return new Error("Dns result is empty ")
     }
     return result
   
    }
    catch(err:any){
        throw new Error("Unable to process the dns request",err)
    }
}