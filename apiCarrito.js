const ProductosAPI = require("./apiProductos");

class CarritoAPI {
    static carritoId = 0;

    constructor() {
        this.carritos = [];
    }

    crearCarrito() {
        const carrito = {
            id: CarritoAPI.carritoId++,
            timestamp: Date.now(),
            productos: [],
        };
        this.carritos.push(carrito);
        return carrito.id;
    }

    borrarCarrito(id) {
        const oldLenght = this.carritos.length;
        this.carritos = this.carritos.filter((c) => c.id != id);
        if(this.carritos.length != oldLenght) {
            return "Carrito elminiado exitosamente";
        } else {
            return "Error al borrar carrito"
        }
        
    }

    getCarritoById(id) {
        const indexCarrito = this.carritos.findIndex((c) => c.id == id);
        return this.carritos[indexCarrito];
    }

    agregarProducto(id, producto) {
        const indexCarrito = this.carritos.findIndex((c) => c.id == id);
        this.carritos[indexCarrito].productos.push(producto);
    }

    borrarProducto(id, idProd) {
        const indexCarrito = this.carritos.findIndex((c) => c.id == id);
        this.carritos[indexCarrito].productos = this.carritos[indexCarrito].productos.filter(
            (p) => p.id != idProd
        );
    }
}

module.exports = CarritoAPI;
