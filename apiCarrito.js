const fs = require("fs");

class CarritoAPI {
    static carritoId = 1;

    constructor() {
        this.carritos = [];
        this.fileName = "carritos";
        this.archivo = `${__dirname}/src/${this.fileName}.kirby`;
    }

    async crearCarrito() {
        const carrito = {
            id: CarritoAPI.carritoId++,
            timestamp: Date.now(),
            productos: [],
        };
        this.carritos = await this.cargar().then(this.carritos.push(carrito));
        await this.guardar();
        return carrito.id;
    }

    async borrarCarrito(id) {
        const oldLenght = this.carritos.length;
        this.carritos = this.carritos.filter((c) => c.id != id);
        if (this.carritos.length != oldLenght) {
            await this.guardar();
            return "Carrito elminiado exitosamente";
        } else {
            return "Error al borrar carrito";
        }
    }

    async getCarritoById(id) {
        this.carritos = await this.cargar();
        const indexCarrito = this.carritos.findIndex((c) => c.id == id);
        return this.carritos[indexCarrito];
    }

    async agregarProducto(id, producto) {
        console.log({producto});
        const indexCarrito = this.carritos.findIndex((c) => c.id == id);
        if(indexCarrito != -1) {
            this.carritos[indexCarrito].productos.push(producto);
            await this.guardar();
        } else {
            return "Id inexistente.";
        }
    }

    async borrarProducto(id, idProd) {
        const indexCarrito = this.carritos.findIndex((c) => c.id == id);
        this.carritos[indexCarrito].productos = this.carritos[indexCarrito].productos.filter(
            (p) => p.id != idProd
        );
        await this.guardar();
    }

    async guardar() {
        try {
            await fs.promises.writeFile(this.archivo, JSON.stringify(this.carritos));
            console.log("Guardado con éxito");
        } catch (e) {
            console.log(`Error guardando datos en ${this.fileName}`, e);
        }
    }

    async cargar() {
        try {
            console.log("Cargando desde", this.fileName);
            const dataJson = await fs.promises.readFile(this.archivo, "utf-8");
            const data = await JSON.parse(dataJson);
            console.log("Cargado con éxito");
            return data;
        } catch (e) {
            console.log(`Error cargando datos desde ${this.fileName}`, e);
        }
    }

    async inicializar() {
        this.carritos = await this.cargar();
    }
}

module.exports = CarritoAPI;
