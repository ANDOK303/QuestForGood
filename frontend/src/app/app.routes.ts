import { Routes } from '@angular/router';
import { JuegosComponent } from './pages/juegos/juegos.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { CompraComponent } from './pages/compra/compra.component';

export const routes: Routes = [
  { path: '', redirectTo: 'juegos', pathMatch: 'full' },
  { path: 'juegos', component: JuegosComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'compra/:id', component: CompraComponent },
  { path: '**', redirectTo: 'juegos' }
];