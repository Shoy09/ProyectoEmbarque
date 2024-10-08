import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterLink, NgClass, CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'] // Corregido a 'styleUrls'
})
export class SideBarComponent implements OnInit {
  isSidebarOpen = false;
  imagen_usuario: string = '';
  apel_nomb: string = '';
  tipo_usuario: string = '';
  defaultImage: string = 'imgUsuario.png'; // Ruta de la imagen por defecto

  constructor() {}

  ngOnInit(): void {
    if (typeof sessionStorage !== 'undefined') {
      this.apel_nomb = sessionStorage.getItem('nombrey_apellido') || '';
      this.imagen_usuario = sessionStorage.getItem('imagen_usuario') || '';
      this.tipo_usuario = sessionStorage.getItem('tipo_usurio') || '';
    }
  }
  getUserImage(): string {
    // Verifica si imagen_usuario es nula, indefinida o una cadena vacía
    if (!this.imagen_usuario || this.imagen_usuario === 'null') {
      return this.defaultImage;
    }
    return this.imagen_usuario;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
 
  }


}
