export interface UserRequest{
    id:number,
    prompt:string,
    maxToken?:number
}
export type HttpStatus=200|400|429|500