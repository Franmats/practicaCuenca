import express from "express"
import handlebars from "express-handlebars"
import {Server} from "socket.io"
import mongoose from "mongoose"
import routerViews from "./routes/views.router.js"
import routerProducts from "./routes/products.route.js"
import routerCart from "./routes/cart.router.js"
import routerChat from "./routes/chat.router.js"
import { ProductManager } from "./DAO/fileManager/ProductManager.js"
import __dirname from "./utils.js"
import chatModel from "./DAO/mongoManager/models/chat.model.js"

const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())

const conected =() => {
    //Conexion de sockets 
    io.on("connection", socket => {
        socket.on("new-product", async product => {//io para que se actualice en todas las pantallas o cokets, en cambio con socket solo actualizara el user q este conectado
            const manager = new ProductManager()
            await manager.addProduct(product)

            
            
            const products1= await manager.getProducts()
            socket.emit("recargar-tabla", products1)
        })

        socket.on("eliminar-producto", async id2 => {
            const manager = new ProductManager()
            console.log(id2);
            await manager.deleteProduct(id2)

            const products1= await manager.getProducts()
            socket.emit("recargar-tabla", products1)
        })

})
}

const chatFunc = ()=> {
    io.on("connection", socket => {
        socket.on("new", user => console.log(`${user} se acaba de conectar`))
    
        socket.on("message", async data => {
            console.log(data);
            await chatModel.create(data)
    
            const mensajes = await chatModel.find()
            io.emit("logs",mensajes)
        })
    })
    
}



//MONGODB

mongoose.set("strictQuery",false)
mongoose.connect("mongodb://127.0.0.1:27017/", {
    dbName:"ecommerce"
}) .then(()=> {
    console.log("conectado")
    conected()
    chatFunc()
})
    .catch(e=> console.log("No se puede conectar a mongo",e))


//sockets y Http
const httpServer = app.listen(8080, () => console.log("Listening....."))
const io = new Server(httpServer)
//Multer
app.use("/static",express.static(__dirname + "/public"))
//Handlebars
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")









//Rutas
app.use("/",routerViews)
app.use("/chat",routerChat)
app.use("/api/products",routerProducts)
app.use("/api/carts",routerCart)
