import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [


  {
    path: 'admin',
    loadComponent:()=> import('./features/Admin/admin-dashboard/admin-dashboard').then(m=>m.AdminDashboard),
    canActivate: [AuthGuard]
  },
  {
    path: 'employee',
    loadComponent:()=> import('./features/Employee/employee-dashboard/employee-dashboard').then(m=>m.EmployeeDashboard),
    canActivate: [AuthGuard]
  },
  {
    path: 'superadmin',
    loadComponent:()=> import('./features/SuperAdmin/dashboard/dashboard').then(m=>m.Dashboard),
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    loadComponent:()=> import('./features/SuperAdmin/user/all-user/all-user').then(m=>m.AllUser),
    canActivate: [AuthGuard]
  },
  {
    path: 'users/create_admin',
    loadComponent:()=> import('./features/SuperAdmin/user/create-admin/create-admin').then(m=>m.CreateAdmin),
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
