import mongoose from "mongoose";
const user=new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Username can not be empty"],
        unique:true,
        index:true,//Index best for searching but can be exprnsive if we perform  more write operation then read 
    },
    email:{
        type:String, 
        required:[true,"Email can not be empty"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Password can not be null"],
        unique:true
    }
},{
    timestamps:true,
})

const User=mongoose.model("User",user);
export default User;