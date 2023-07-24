import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComprarComponent } from './comprar/comprar.component';
import { EditarProductosComponent } from './editar-productos/editar-productos.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { ListarProductosComponent } from './listar-productos/listar-productos.component';
import { MostrarProductosCategoriaComponent } from './mostrar-productos-categoria/mostrar-productos-categoria.component';
import { MostrarProductosComponent } from './mostrar-productos/mostrar-productos.component';

const routes: Routes = [
  {path:'',component: MostrarProductosComponent},
  {path:'mostrar_productos',component: MostrarProductosComponent},
  {path:'mostrar_productos_categoria/:categoria',component: MostrarProductosCategoriaComponent},
  {path:'productos',component: ListarProductosComponent},
  {path:'productos/:categoria',component: ListarProductosComponent},
  {path:'productos/editar/:idProducto',component: EditarProductosComponent},
  {path:'productos/agregar',component: EditarProductosComponent},
  {path:'comprar',component: ComprarComponent},
  // {path:'**',redirectTo:'/productos',pathMatch:'full'},
  { path: '404', component: ErrorPageComponent },
  { path: '**', redirectTo: '/404', pathMatch:'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
