const ProductosApi = require("./apiProductos.js");
const CarritosAPI = require("./apiCarrito");
const express = require("express");
const { Router } = express;

const routerProd = Router();
const routerCart = Router();
const app = express();
const productosApi = new ProductosApi();
const carritosApi = new CarritosAPI();

const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/productos", routerProd);
app.use("/api/carrito", routerCart);

// ---------------------------------------------- ROUTER PRODUCTOS ----------------------//

// Me permite listar todos los productos disponibles ó un producto por su ID
// USUARIO + ADMIN
routerProd.get("/:id?", async (req, res) => {
    const id = req.params.id;
    if (isNaN(id)) {
        res.send(JSON.stringify(await productosApi.getAll()));
    } else {
        res.send(JSON.stringify(await productosApi.getProductoById(id)));
    }
});

// Para incorporar productos al listado
// ADMIN
routerProd.post("/", async (req, res) => {
    const admin = req.body.admin;
    const producto = req.body.producto;
    if (admin) {
        const prodId = await productosApi.addProducto(producto);
        res.send(JSON.stringify(prodId));
    } else {
        res.send({ error: -1, descripcion: "Ruta /api/productos/ Método POST no autorizado" });
    }
});

// Actualiza un producto por su ID
// ADMIN
routerProd.put("/:id", (req, res) => {
    const admin = req.body.admin;
    const id = req.params.id;
    const producto = req.body.producto;
    if (admin) {
        const prodId = productosApi.setProductoById(id, producto);
        res.send(prodId);
    } else {
        res.send({ error: -1, descripcion: "Ruta /api/productos/ Método PUT no autorizado" });
    }
});

// Borra un producto por su ID
// ADMIN
routerProd.delete("/:id", (req, res) => {
    const admin = req.body.admin;
    const id = req.params.id;
    if (admin) {
        const prodId = productosApi.deleteProductoById(id);
        res.send(prodId);
    } else {
        res.send({ error: -1, descripcion: "Ruta /api/productos/ Método DELETE no autorizado" });
    }
});

// ---------------------------------------------- ROUTER CARRITO ------------------------//

// Crea un carrito y devuelve su ID
routerCart.post("/", (req, res) => {
    res.send(JSON.stringify(carritosApi.crearCarrito()));
});

// Vacía un carrito y lo elimina
routerCart.delete("/:id", (req, res) => {
    const id = req.params.id;
    res.send(JSON.stringify(carritosApi.borrarCarrito(id)));
});

// Me permite listar todos los productos guardados en el carrito
routerCart.get("/:id/productos", (req, res) => {
    const id = req.params.id;
    const carrito = carritosApi.getCarritoById(id);
    if (carrito) {
        res.send(JSON.stringify(carrito.productos));
    } else {
        res.send("Carrito inexistente");
    }
});

// Para incorporar productos al carrito por su ID de producto
routerCart.post("/:id/productos", (req, res) => {
    const idCart = req.params.id;
    const idProd = req.body.idProd;
    const producto = productosApi.getProductoById(idProd);
    if (producto.error) {
        res.send(JSON.stringify(producto));
    } else {
        carritosApi.agregarProducto(idCart, producto);
        res.send(JSON.stringify("Producto agregado."));
    }
});

// Eliminar un producto del carrito por su ID de carrito e ID de producto
routerCart.delete("/:id/productos/:id_prod", (req, res) => {
    const idCart = req.params.id;
    const idProd = req.params.id_prod;
    carritosApi.borrarProducto(idCart, idProd);
    res.send("El producto fue borrado");
});

// PRUEBAS

// productosApi.addProducto({
//     nombre: "Guerra Biológica",
//     descripcion: "Efectivo contra tu vecino molesto.",
//     codigo: "GB398",
//     stock: 10,
//     precio: 800000000,
//     thumbnail: "https://cdn3.iconfinder.com/data/icons/finance-152/64/9-256.png",
// });

// productosApi.addProducto({
//     nombre: "Soborno",
//     descripcion: "Funciona sin fallas, siempre y cuando no te enganchen.",
//     codigo: "S133",
//     stock: 15,
//     precio: 75000,
//     thumbnail: "https://cdn3.iconfinder.com/data/icons/finance-152/64/7-256.png",
// });

// productosApi.addProducto({
//     nombre: "Manteca Brillante",
//     descripcion: "Es dura. No se recomienda comer.",
//     codigo: "MB078",
//     stock: 50,
//     precio: 150000,
//     thumbnail: "https://cdn3.iconfinder.com/data/icons/finance-152/64/29-256.png",
// });

// productosApi.addProducto({
//     nombre: "Martillo Bromista",
//     descripcion: "Convierte a tus amigos en monedas de diez centavos sin esfuerzo.",
//     codigo: "MB120",
//     stock: 2,
//     precio: 700,
//     thumbnail: "https://cdn3.iconfinder.com/data/icons/finance-152/64/26-256.png",
// });

// carritosApi.crearCarrito();
// carritosApi.crearCarrito();
// carritosApi.crearCarrito();


// PRENDER EL SERVER jijiji

const server = app.listen(PORT, () => {
    console.log("Servidor escuchando en puerto ", PORT);
});
server.on("error", (e) => console.log("Error en el servidor: ", e));

