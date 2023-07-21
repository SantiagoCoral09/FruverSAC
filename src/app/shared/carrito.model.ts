export class CarritoModel {
    constructor(

        public idCarrito: string,
        public idUsuario: string,
        public valor_total: number,
        public fechaCreacion: string //= new Date()
    ) {
        // this.idCarrito=idCarrito;
    }
}

