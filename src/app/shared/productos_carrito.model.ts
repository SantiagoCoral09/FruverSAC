import { ProductoModel } from "./producto.model";

export class ProductosCarritoModel {
    constructor(
        public idProductoCarrito: string,
        public CarritoId: string,
        public ProductoId: string,
        public cantidad: number,
        public valor_parcial: number,
        public producto: ProductoModel 
        
    ) {
    }
}

