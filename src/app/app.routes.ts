import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [


  {  // admin  route starts from here
    path: 'admin',
    loadComponent:()=> import('./features/Admin/dashboard/admin-dashboard/admin-dashboard').then(m=>m.AdminDashboard),
    canActivate: [AuthGuard]
  },
  {
    path: 'employees',
    loadComponent:()=> import('./features/Admin/user/all-employee/all-employee').then(m=>m.AllEmployee),
    canActivate: [AuthGuard]
  },
  {
    path: 'groups/create',
    loadComponent:()=>import('./shared/Group_shared_module/create-group/create-group').then(m=>m.CreateGroup)
  },
  {
    // Employee routes Start from here
    path: 'employee',
    loadComponent:()=> import('./features/Employee/employee-dashboard/employee-dashboard').then(m=>m.EmployeeDashboard),
    canActivate: [AuthGuard]
  },
  {
    // SuperAdmin routes start from here
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
    path: 'users/create_employee',
    loadComponent:()=> import('./shared/User_shared_module/create-employee/create-employee').then(m=>m.CreateEmployee),
    canActivate: [AuthGuard]
  },
  {
    path: 'groups/create',
    loadComponent:()=>import('./shared/Group_shared_module/create-group/create-group').then(m=>m.CreateGroup),
    canActivate:[AuthGuard]
  },
  {
    path: 'profile',
    loadComponent:()=> import('./features/SuperAdmin/Profile/profile/profile').then(m=>m.Profile),
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
