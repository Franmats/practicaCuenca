import mongoose from "mongoose";

const chatModel = mongoose.model("messages", new mongoose.Schema({
    user: {type:String, required:true},
    txt:{type:String, required:true},
}))



export default chatModel