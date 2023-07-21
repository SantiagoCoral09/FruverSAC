import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarProductosCategoriaComponent } from './listar-productos-categoria.component';

describe('ListarProductosCategoriaComponent', () => {
  let component: ListarProductosCategoriaComponent;
  let fixture: ComponentFixture<ListarProductosCategoriaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListarProductosCategoriaComponent]
    });
    fixture = TestBed.createComponent(ListarProductosCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
