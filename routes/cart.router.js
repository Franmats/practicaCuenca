import { Router } from "express";
import {CartManager} from "../DAO/fileManager/CartManager.js"
import CartModel from "../DAO/mongoManager/models/cart.model.js";

const router = Router()

router.get("/", async (req, res)=> {
  const result = await CartModel.find()
  res.send(result)
})


router.post("/", async (req, res)=> {
  const result = await CartModel.create({products:[]})
  res.send(result)
})


//BUSCAR POR CARRITO FUNCIONA
router.get("/:cid", async (req, res)=> {
    const cid = req.params.cid
    console.log(cid);
    const prod = await CartModel.findOne({ _id: cid })
    if (!prod) res.send({error:"Carrito no existente"})
    else res.send(prod)
})

// INTRODUCIR UN PRODUCTO EN UN DETERMINADO CARRITO CON ERRORES 
router.post("/:cid/product/:pid", async (req,res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    const newProduct = req.body
    const carrito =  await CartModel.findById(cid)
    carrito.products.push({id:pid,quantity:2})
    const result = carrito.save()
    res.send(result) 
    /*     {
      "product":"1",
      "quantity": "1",
  } */
})

export default router

