import mongoose from "mongoose";

const productModel = mongoose.model("products", new mongoose.Schema({
    title: {type:String, required:true},
    description:{type:String, required:true},
    thumbnail:{type:String, required:true},
    code:{type:String, required:true},
    stock:Number,
    price:Number
}))



export default productModel