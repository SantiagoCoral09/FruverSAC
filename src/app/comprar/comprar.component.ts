import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarritoModel } from '../shared/carrito.model';
import { CarritoService } from '../shared/carrito.service';
import { ComprarService } from '../shared/comprar.service';
import { CompraModel } from '../shared/compras.model';
import { ProductosCarritoService } from '../shared/productos-carrito.service';

@Component({
  selector: 'app-comprar',
  templateUrl: './comprar.component.html',
  styleUrls: ['./comprar.component.css']
})
export class ComprarComponent implements OnInit {

  carrito = new CarritoModel("", "", 0, "");
  compra = new CompraModel("", "", "", "", "", "", "", this.carrito);
  showModal: boolean = false;

  constructor(private carritoService: CarritoService, private compraService: ComprarService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    const idCarritoS = sessionStorage.getItem('idCarritoS');
    const idCarritoL = localStorage.getItem('idCarritoL');
    // this.showModal=false;
    console.log(this.showModal);
    if (idCarritoS) {
      this.carritoService.obtenerCarritoByID(idCarritoS).subscribe(data => {
        this.carrito = data[0];
      });
    }

  }
  onSubmit() {
    console.log("Comprar");
    console.log(this.carrito);
    this.compra.idCarritoCompra = this.carrito.idCarrito;
    console.log(this.compra);
    this.compraService.agregarCompra(this.compra).subscribe(data => {
      //////
      sessionStorage.removeItem('idCarritoS');
      localStorage.removeItem('idCarritoL');
      const miModalElement = document.getElementById('exampleModalCenter');
      if (miModalElement) {
        console.log("Modal");
        miModalElement.style.display = 'block'; // Mostrar el modal
      }

    });
  }

  aceptarModal() {
    // Redirigir a la página principal
    const miModalElement = document.getElementById('exampleModalCenter');
    if (miModalElement) {
      miModalElement.style.display = 'none'; // Mostrar el modal
      this.router.navigate(['/mostrar_productos']);
    }
  }
}
