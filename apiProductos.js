const fs = require("fs");

class ProductosAPI {
    constructor() {
        this.productos = [];
        console.log(Array.isArray(this.productos));
        this.fileName = "productos";
        this.archivo = `${__dirname}/src/${this.fileName}.kirby`;

        this.productos = this.cargar();
    }

    static contadorId = 1;

    addProducto(producto) {
        if (this.check(producto)) {
            producto.id = ProductosAPI.contadorId++;
            producto.timestamp = Date.now();
            this.productos.push(producto);
            return producto.id;
        } else {
            return { error: "El producto no cumple los requisitos" };
        }
    }

    getProductoById(id) {
        // Filtrá los productos que tengan id distitnto y retorná el único producto del array -> [0]
        let producto = this.productos.filter((prod) => prod.id == id)[0];
        if (producto != undefined) {
            return producto;
        } else {
            return { error: "Producto no encontrado" };
        }
    }

    getAll() {
        console.log(this.productos);
        return this.productos;
    }

    setProductoById(id, producto) {
        if (this.check(producto)) {
            for (let i = 0; i < this.productos.length; i++) {
                if (this.productos[i].id == id) {
                    producto.id = id;
                    producto.timestamp = Date.now();
                    this.productos[i] = producto;
                    return producto.id;
                }
            }
        } else {
            return { error: "El producto no cumple con los requisitos" };
        }
    }

    deleteProductoById(id) {
        const prodEliminado = this.productos.filter((prod) => prod.id == id);
        if (prodEliminado.length > 0) {
            this.productos = this.productos.filter((prod) => prod.id != id);
            this.guardar();
            return "Producto borrado exitosamente";
        } else {
            return { error: "El id no existe!" };
        }
    }

    async guardar() {
        try {
            //console.log("Guardando en", this.fileName);
            await fs.promises.writeFile(this.archivo, JSON.stringify(this.productos));
            //console.log("Guardado con éxito");
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

    check(producto) {
        if (!producto.nombre) {
            console.log("error en  nombre");
            return false;
        }
        if (!producto.descripcion) {
            console.log("error en descripcion");
            return false;
        }
        if (!producto.codigo) {
            console.log("error en codigo");
            return false;
        }
        if (!producto.precio) {
            console.log("error en precio");
            return false;
        } else {
            const precio = Number(producto.precio);
            if (isNaN(precio)) {
                console.log("error en precio");
                return false;
            }
        }
        if (!producto.thumbnail) {
            console.log("error en thumbnail");
            return false;
        }
        if (!producto.stock) {
            console.log("error en stock");
            return false;
        }
        return true;
    }
}

module.exports = ProductosAPI;