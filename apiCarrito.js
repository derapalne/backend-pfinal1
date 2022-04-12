const fs = require("fs");

class CarritoAPI {
    static carritoId = 1;

    constructor() {
        this.fileName = "carritos";
        this.archivo = `${__dirname}/src/${this.fileName}.kirby`;
    }

    async crearCarrito() {
        const carrito = {
            id: CarritoAPI.carritoId++,
            timestamp: Date.now(),
            productos: [],
        };
        const carritos = await this.cargar().then(() => carritos.push(carrito));
        await this.guardar(carritos);
        return carrito.id;
    }

    async borrarCarrito(id) {
        const carritos = await this.cargar();
        const oldLenght = carritos.length;
        carritos = carritos.filter((c) => c.id != id);
        if (carritos.length != oldLenght) {
            await this.guardar(carritos);
            return "Carrito elminiado exitosamente";
        } else {
            return "Error al borrar carrito";
        }
    }

    async getCarritoById(id) {
        const carritos = await this.cargar();
        const indexCarrito = carritos.findIndex((c) => c.id == id);
        return carritos[indexCarrito];
    }

    async agregarProducto(id, producto) {
        const carritos = this.cargar();
        const indexCarrito = carritos.findIndex((c) => c.id == id);
        if(indexCarrito != -1) {
            carritos[indexCarrito].productos.push(producto);
            await this.guardar(carritos);
        } else {
            return "Id inexistente.";
        }
    }

    async borrarProducto(id, idProd) {
        const carritos = await this.cargar();
        const indexCarrito = carritos.findIndex((c) => c.id == id);
        carritos[indexCarrito].productos = carritos[indexCarrito].productos.filter(
            (p) => p.id != idProd
        );
        await this.guardar(carritos);
    }

    async guardar(carritos) {
        try {
            await fs.promises.writeFile(this.archivo, JSON.stringify(carritos, null, 2));
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

}

module.exports = CarritoAPI;
