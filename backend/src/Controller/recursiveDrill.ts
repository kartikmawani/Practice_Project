import axios from "axios"
const blackListDirectory=[
    "node_modules",
    "test"
]
const blackListFile=[
    ".png",
    ".exe",
    ".svg",
    ".gitignore"
]
export async function Filteration(){
    //will use etag and webhooks but rn this file is about filteration
      const githubDatas:string[]=await axios.get("githubLink/?recursive=1")
      const modifiedData=githubDatas.filter(githubData=>!blackListFile.some(end=>githubData.endsWith(end)))
      const finalFilteredArray=modifiedData.filter(path=>!blackListDirectory.some(dir=>path.includes(dir)))
      return finalFilteredArray;
}