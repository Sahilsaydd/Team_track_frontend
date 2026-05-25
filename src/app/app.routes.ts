import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '', 
    loadComponent:()=> import('./features/component/dashboard/dashboard').then(m=>m.Dashboard)
  },
  {
    path: 'login',
    loadComponent:()=> import('./features/component/login/login').then(m=>m.Login)
  }
];
