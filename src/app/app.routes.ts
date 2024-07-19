import { Routes } from '@angular/router';
import { LoginComponent } from './Components/Autenticacion/login/login.component';
import { SeguimientoPescaComponent } from './pages/user/seguimiento-pesca/seguimiento-pesca.component';
import { UserComponent } from './pages/user/user.component';
import { EstadisticaSPComponent } from '@pages/user/estadistica-sp/estadistica-sp.component';
import { GastosGeneralesComponent } from '@pages/user/gastos-generales/gastos-generales.component';
import { FlotaComponent } from '@pages/user/flota/flota.component';
import { DbFlotaComponent } from '@pages/user/db-flota/db-flota.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
      path: '',
      component: UserComponent, // Componente principal que contiene la barra lateral y el contenido principal
      children: [
        { path: 'ss', component: SeguimientoPescaComponent },
        {path: 'estadistica-sp', component: EstadisticaSPComponent},
        {path: 'gastos-generales', component: GastosGeneralesComponent},
        {path: 'flota', component: FlotaComponent},
        {path: 'db-flota', component: DbFlotaComponent}
      ]
    },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
];
