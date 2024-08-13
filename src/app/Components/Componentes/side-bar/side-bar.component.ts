import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'] // Corregido a 'styleUrls'
})
export class SideBarComponent implements OnInit {
  isSidebarOpen = false;
  imagen_usuario: string = '';
  apel_nomb: string = '';
  defaultImage: string = 'imgUsuario.png'; // Ruta de la imagen por defecto

  constructor() {}

  ngOnInit(): void {
    if (typeof sessionStorage !== 'undefined') {
      this.apel_nomb = sessionStorage.getItem('nombrey_apellido') || '';
      this.imagen_usuario = sessionStorage.getItem('imagen_usuario') || '';
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
    this.updateLayoutClass();
  }

  updateLayoutClass() {
    const mainContainer = document.querySelector('.layout-container');
    if (mainContainer) { // Verificar si mainContainer no es null
      if (this.isSidebarOpen) {
        mainContainer.classList.add('sidebar-open');
        mainContainer.classList.remove('sidebar-closed');
      } else {
        mainContainer.classList.add('sidebar-closed');
        mainContainer.classList.remove('sidebar-open');
      }
    } else {
      console.error('Elemento .layout-container no encontrado en el DOM.');
    }
  }
}
