 
import type {RawQueryOptions,NormalizedQuery,TagPredicate} from "./day2.types.ts"
//Used to remove overhead created by those import & interface  when compiling typescript
 


function normalizeQuery( options:RawQueryOptions={}):NormalizedQuery{
                const {query="",page=1,limit=10,tags=[]}=options
               const cleanQuery= query.trim();
                
               const safePage= Math.max(1,page)
               const safeLimit=Math.min(50,Math.max(1,limit))
               const offset=(safePage-1)*safeLimit;
               const SafeTags=tags.map(tag=>tag.trim().toLowerCase())
               return {
                query:cleanQuery,
                page:safePage,
                limit:safeLimit,
                offset,
                tags:SafeTags
               }
}