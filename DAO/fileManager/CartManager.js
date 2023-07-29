import { readFile, writeFile, access, constants } from 'fs/promises';

export class CartManager {

    #path
    constructor(path) {
        this.#path = path
    }

    getProductsCart = async() => {
        try {
            const fileExists = await access("carrito.json", constants.F_OK | constants.R_OK)
            if (fileExists == undefined ) {
                const data = await readFile("./carrito.json", "utf-8");
                const read = JSON.parse(data)
                return read;
            } else {
                await writeFile("carrito.json", "[]", "utf-8");
                console.log("El archivo carrito.json fue creado.");
                return [];
            }
        } catch (error) {
            console.error("Error al leer o crear el archivo:", error);
            return []; 
        }       
    }

    getNextId = async () => {
        let p = await this.getProductsCart()
        let count =  p.length
        const lastCartId = count > 0 ? p[count - 1].id : 0; 
        const nextID = lastCartId + 1;
        return nextID;  
    }
    createCart = async () => {
        let p = await this.getProductsCart()
        const cart = {
            id: await this.getNextId(),
            products:[]
        }
        p.push(cart)
        const carritoString = JSON.stringify(p)
        await writeFile("carrito.json", carritoString)

        }

    

    //METODO PARA BUSCAR UN PRODUCTO SEGUN ID
    getCartById = async (id) => {
        let o = await this.getProductsCart()

        const carritoFiltrado = o.find(e => e.id === id)
            
        if ((carritoFiltrado.id >= 1) && (typeof id == "number")) { //VALIDO CON EL TYPE OF QUE LA ENTRADA DEL PARAMETRO SE SOLO UN NUMERO
            return carritoFiltrado
        } else {
            return console.log("Not Found") }
    }

    createProductCart = async (cid, pid, newProduct)=> {

        let carrito = await this.getCartById(cid)
        let productoEnCarrito = carrito.products

        console.log(productoEnCarrito);
        console.log(carrito);
        //esta instacia pushea el producto dentro de la array products del carrito selecionado
        const estaRepetido = productoEnCarrito.some(e => e.product == pid) //buscamos con el metodo some algún producto q este repetido y nos devuelva un valor boleano
        if (estaRepetido) { // si el producto esta repetido
            const product1 = productoEnCarrito.find(e => e.product  == pid) // el metodo find busca el producto repetido segun el id
            const as = productoEnCarrito.filter(e=> e.id != pid)
            product1.quantity++ // modifica el valor de la cantidad y no pushea otro producto igual al carrito
            return this.updateCart(carrito)
        }else {
            carrito.products.push(newProduct)
            return this.updateCart(carrito)
        }

    

    }

    updateCart = async (data)=>{
        let n = await this.getProductsCart()
        const idx = n.findIndex(e => e.id == data.id)
        n[idx] = data

        const carritoString = JSON.stringify(n)
        return await writeFile("carrito.json", carritoString)

    }


}
