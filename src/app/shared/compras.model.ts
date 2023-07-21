import { CarritoModel } from "./carrito.model";

export class CompraModel {
    constructor(

        public idCompra: string,
        public idCarritoCompra: string,
        public nombres: string,
        public correo: string,
        public direccion: string,
        public metodo_pago: string,
        public fechaCompra: string,

        public carrito: CarritoModel

    ) {
    }
}