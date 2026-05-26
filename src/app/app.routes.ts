import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  {
    path: '', 
    loadComponent:()=> import('./features/component/dashboard/dashboard').then(m=>m.Dashboard),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadComponent:()=> import('./features/component/login/login').then(m=>m.Login)
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
