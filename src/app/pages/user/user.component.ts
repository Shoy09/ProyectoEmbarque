import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideBarComponent } from '../../Components/Componentes/side-bar/side-bar.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterOutlet, SideBarComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {

}
