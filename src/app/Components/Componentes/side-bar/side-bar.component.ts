import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent implements OnInit {
  isSidebarOpen = false;

  constructor() {}

  ngOnInit(): void {}

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
