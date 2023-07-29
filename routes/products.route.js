import { Router } from "express";
import productModel from "../DAO/mongoManager/models/product.model.js"

const router = Router()

router.get("/",async (request, response) => {
  const result = await productModel.find()
    response.send(result)
  })

router.get("/query", async (request, response) => {
    let limit = request.query.limit //escribir en el navegador ?limit=2
    if (limit) {
        limit = limit.toLocaleLowerCase()
        const resultado = await productModel.find({}).limit(limit)
        return response.send(resultado)
    }
  })

  //MOSTRAR PRODUCTO SEGUN ID CON METODO DE CLASE FUNCIONA!!!
router.get("/:id",async (request, response) => {
    const id = request.params.id//string
    const prod = await productModel.findOne({_id: id })
    if (!prod) response.send({error:"Producto no encontrado"})
    else response.send({respuesta:"producto encontrado:",prod})
})
  


//CREAR UN NUEVO PRODUCTO CON POST FUNCIONA!!!
router.post("/", async (req,res) => {
    const newProdcut =  req.body
    const result = await productModel.create(newProdcut)
    res.send(result)
    /*     {
      "name":"producto post",
      "description": "producto post1",
      "price":100000,
      "thumbnail":"por ahora no",
      "code":1584,
      "stock":26
  } */
})


//ACTUALIZAR UN PRODUCTO CON PUT SI FUNCIONA!!!
router.put("/", async (request, response) => {
  let id = request.query.id //escribir en el navegador ?id=2&parametro=title&update=CambioTitulo
  let parametro = request.query.parametro
  let update = request.query.update
  
 
  const resultado = await productModel.updateOne({_id:id}, {$set:{[parametro]:update}})
  response.send({status:"success", resultado})
})
// ELIMINAR UN PRODUCTO CON DELETE SI FUNCIONA
router.delete("/:id", async (request, response) => {
  const id = request.params.id
  const result = await productModel.deleteOne({_id: id})
  response.send({status:"success", result})
})
export default router