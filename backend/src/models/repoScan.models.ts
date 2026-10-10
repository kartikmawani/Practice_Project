import mongoose from "mongoose";

const repoSchema=new mongoose.Schema({
    repoUrl:{
        type:String,
        index:true,
        required:true
    },
    language:{
        type:String,
        required:true
    },
    scanCount:{
        type:Number,
        required:true
    },
    scanDates:{
        type:[Date],
        required:true

    }
})
    //array of object
    //items:[{
     //   value:String
    //}]
    //OR
    //make a subdocument
    //const Sub=new Mongoose.Schema({
        
    //})
    //items:[Sub]

const Repo=mongoose.model("Repo",repoSchema)
export default Repo