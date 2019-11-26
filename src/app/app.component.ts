import { Component } from '@angular/core';
import { ProductosService } from './productos.service';
import { HttpClient } from '@angular/common/http';

@Component({

  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angularApp';

  lista = null;
  prod = {
    codigo: null,
    descripcion: null,
    precio: null
  }

  constructor(private productosServicio: ProductosService) {}
  uploadedFiles: Array <File>;
  ngOnInit() {
    this.recuperarTodos();
  }

  fileChange(element){
    this.uploadedFiles = element.target.files
  }

  recuperarTodos() {
    this.productosServicio.listar().subscribe(result => {
      this.lista = result;
    });
  }

  nuevo() {
    let formData = new FormData();
     for(var i = 0; i < this.uploadedFiles.length; i++){
       formData.append("uploads[]",
       this.uploadedFiles[i],
       this.uploadedFiles[i].name);
     }

     formData.append("codigo", this.prod.codigo);
     formData.append("descripcion", this.prod.descripcion);
     formData.append("precio", this.prod.precio);
    this.productosServicio.nuevo(formData).subscribe(result => {
      console.log(result)
      // if (result=='ok') {
      if (result) {
        this.limpiar();
        this.recuperarTodos();
      }
    });
  }

  eliminar(codigo) {
  	if(!confirm("Esta seguro que desea eliminar este registro?"))
  		return;
    this.productosServicio.eliminar(codigo).subscribe(result => {  
      console.log(result)    
      if (result=='OK') {      
        this.recuperarTodos();
      }
    });
  }

  actualizar() {
    this.productosServicio.actualizar(this.prod).subscribe(result => {
      console.log(result)
      // @ts-ignore
      if (result.affectedRows == '1') {
        this.limpiar();
        this.recuperarTodos();
      }
    })
  }
  
  mostrar(codigo) {
    this.productosServicio.mostrar(codigo).subscribe(result => {
      // @ts-ignore
      this.prod = result[0]
      // console.log(result[0])
    });
  }

  hayRegistros() {
    return true;
  }
  limpiar(){
    this.prod = { 
      codigo:null, 
      descripcion:null, 
      precio:null
    };
  }

}