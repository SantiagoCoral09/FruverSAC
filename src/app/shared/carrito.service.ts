import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CarritoModel } from './carrito.model';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  BASE_URL = 'https://fruver-sac.onrender.com/';

  constructor(private http: HttpClient) { }

  obtenerCarritos(){///Obtener todos los carritos de la BD
    return this.http.get<CarritoModel[]>(`${this.BASE_URL}/carritos`);
  }
  obtenerCarritoByUser(idUsuario:string){///Un solo carrito del usuario
    return this.http.get<CarritoModel[]>(`${this.BASE_URL}/carritoUser/${idUsuario}`);
  }
  obtenerCarritoByID(idCarrito:string){///Un solo carrito por su id
    return this.http.get<CarritoModel[]>(`${this.BASE_URL}/carritoId/${idCarrito}`);
  }
  agregarCarrito(carrito:CarritoModel){
    return this.http.post<CarritoModel>(`${this.BASE_URL}/carrito`,carrito);
  }
  actualizarCarrito(carrito: CarritoModel) { 
    return this.http.put<string>(`${this.BASE_URL}/carrito/${carrito.idCarrito}`,carrito);
  }
  borrarCarrito(idCarrito: string) { 
    return this.http.delete<string>(`${this.BASE_URL}/carrito/${idCarrito}`);
  }
}
