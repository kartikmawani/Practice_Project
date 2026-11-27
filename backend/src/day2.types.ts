export interface RawQueryOptions{
    query?:string,
    page?:number,
    limit?:number,
    tags?:string[]
}
export interface NormalizedQuery{
    query:string,
    page:number,
    limit:number,
    offset:number,
    tags:string[]
}
export type TagPredicate=(tag:string)=>boolean
