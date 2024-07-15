import { Routes } from '@angular/router';
import { LoginComponent } from './Components/Autenticacion/login/login.component';
import { SeguimientoPescaComponent } from './pages/user/seguimiento-pesca/seguimiento-pesca.component';
import { UserComponent } from './pages/user/user.component';
import { EstadisticaSPComponent } from '@pages/user/estadistica-sp/estadistica-sp.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
      path: '',
      component: UserComponent, // Componente principal que contiene la barra lateral y el contenido principal
      children: [
        { path: 'ss', component: SeguimientoPescaComponent },
        {path: 'estadistica-sp', component: EstadisticaSPComponent}
      ]
    },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
];
