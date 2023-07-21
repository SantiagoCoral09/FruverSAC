export class ProductoModel {
    constructor(
        public idProducto: string,
        public nombre: string, 
        public precio: number,
        public cantidad_producto: number,
        public descripcion: string,
        public categoria: string,
        public imagen:string
    ) 
    {
        // this.idProducto=idProducto;
    }
}

