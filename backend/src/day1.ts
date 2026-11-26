import type {UserRequest} from "./types.ts"
import type {HttpStatus} from "./types.ts"
//We use type here because it will surely be reomved at the time of compilation,if we don't use it then it is dependent  on the engine.

interface ValidationResultOK{
    ok:true,
    cleanPrompt:string
}
interface ValidationResultError{
    ok:false,
    status:400,
    error:string
}
function validatePrompt(raw:string):ValidationResultOK|ValidationResultError{
    
     const prompt:string=raw.trim()
     if(!prompt|| prompt.length===0){
        return {
            ok:false,
            status:400,
            error:"Please provide prompt suitably"
        }
    }
     return{
            ok:true,
            cleanPrompt:prompt
     }
}
// Promise<ValidationResultOK|ValidationResultError>

// export  async function handleRequest(req:UserRequest):Promise<ValidationResultOK|ValidationResultError>{
//           const result=validatePrompt(req.prompt);
//           if(result.ok==false){
//                 return {
//                     ok:false,
//                      status:400,
//                       error:result.error
//                 }
//           }
//           return {
//               ok:true,
//               cleanPrompt:result.cleanPrompt
//           }
// }
export  async function handleRequest(req:UserRequest):Promise<{status:HttpStatus,body:string}>{
    const result=validatePrompt(req.prompt);
    if(result.ok===false){
          return {
               status:400,
               body:result.error
          }
    }
    return {
       status:200,
       body:result.cleanPrompt
    }
}
async function main(){
    const result1=handleRequest({id:1,prompt:"Why are we still here"})
    const result2=handleRequest({id:12,prompt:"",maxToken:23})
    const result3=handleRequest({id:12,prompt:"      "})

    console.log(result1);
    console.log(result2);
    console.log(result3);
}
 main();