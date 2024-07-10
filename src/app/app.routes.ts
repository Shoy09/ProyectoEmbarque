import { Routes } from '@angular/router';
import { LoginComponent } from './Components/Autenticacion/login/login.component';
import { SeguimientoPescaComponent } from './pages/user/seguimiento-pesca/seguimiento-pesca.component';
import { UserComponent } from './pages/user/user.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
      path: '',
      component: UserComponent, // Componente principal que contiene la barra lateral y el contenido principal
      children: [
        { path: 'ss', component: SeguimientoPescaComponent },
        // Otras rutas hijas que desees tener dentro del diseño principal
      ]
    },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
];
  