import { Routes } from '@angular/router';
import { LoginComponent } from './Components/Autenticacion/login/login.component';
import { SeguimientoPescaComponent } from './pages/user/seguimiento-pesca/seguimiento-pesca.component';
import { UserComponent } from './pages/user/user.component';
import { EstadisticaSPComponent } from '@pages/user/estadistica-sp/estadistica-sp.component';
import { GastosGeneralesComponent } from '@pages/user/gastos-generales/gastos-generales.component';
import { DbFlotaComponent } from '@pages/user/db-flota/db-flota.component';
import { EstadisticaMaterializacionComponent } from '@pages/user/estadistica-materializacion/estadistica-materializacion.component';
import { ProduccionToneladasComponent } from '@pages/user/produccion-toneladas/produccion-toneladas.component';
import { AuthGuard } from './guards/auth.guard';
import { EstadisticaToneProceComponent } from '@pages/user/estadistica-sp/graficas/estadistica-tone-proce/estadistica-tone-proce.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
      path: '',
      component: UserComponent,
      canActivate: [AuthGuard], // Protege las rutas con el AuthGuard
      children: [
        { path: 'ss', component: SeguimientoPescaComponent },
        { path: 'ss/:flotaDPId', component: SeguimientoPescaComponent },
        { path: 'estadistica-sp', component: EstadisticaSPComponent },
        { path: 'gastos-generales', component: GastosGeneralesComponent },
        { path: 'db-flota', component: DbFlotaComponent },
        { path: 'db-flota/:flotaDPId', component: DbFlotaComponent },
        { path: 'materializacion', component: EstadisticaMaterializacionComponent },
        { path: 'produccion', component: ProduccionToneladasComponent },
      ]
    },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
];
