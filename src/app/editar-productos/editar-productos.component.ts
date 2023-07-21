import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoModel } from '../shared/producto.model';
import { ProductoService } from '../shared/producto.service';

@Component({
  selector: 'app-editar-productos',
  templateUrl: './editar-productos.component.html',
  styleUrls: ['./editar-productos.component.css']
})
export class EditarProductosComponent implements OnInit {

  categorias=["Frutas frescas","Verduras frescas","Hierbas y especias","Frutos secos y semillas","Tuberculos y Hortalizas","Exoticos y tropicales"];
  
  idProducto = '';
  titulo='';

  producto = new ProductoModel("", "", 0,0,"","","");

  constructor(private productoService: ProductoService, private route: ActivatedRoute,private router:Router) { }

  ngOnInit() {
    this.idProducto = this.route.snapshot.params['idProducto'];
    console.log(`El id del producto es ${this.idProducto}`);

    if (this.idProducto) {
      //Si hay un id es porque se va a editar uno existente
      this.titulo='Editar producto. ID: '+this.idProducto;
      this.productoService.obtenerProducto(this.idProducto).subscribe(data => {
        this.producto = data[0];
        console.log(this.producto);
      }, error => {
        console.log(error);
      });

    } else {
      //Si no hay ningun id es para agregar uno nuevo
      this.titulo='Agregar producto';
      console.log("Agregar Producto");
    }
  }

  onSubmit() {
    console.log("Submit realizado");
    if(this.producto.idProducto){
      //Editar producto con id
      this.productoService.actualizarProducto(this.producto).subscribe(data=>{
        console.log(data);
        this.router.navigate(['/productos']);
      });
    }
    else{
      //Agregar nuevo
      console.log("Nuevo producto");
      this.productoService.agregarProducto(this.producto).subscribe(data=>{
        console.log(data);
        this.router.navigate(['/productos']);
      });;
    }
  }
}
