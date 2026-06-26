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
    path: 'employee/employee_groups',
    loadComponent:()=> import('./features/Employee/groups/employee-groups/employee-groups').then(m=>m.EmployeeGroups),
    canActivate:[AuthGuard]
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
  // Groups SuperAdmin Routes

  {
    path:'groups',
    loadComponent:()=> import('./shared/Group_shared_module/get-all-groups/get-all-groups').then(m=>m.GetAllGroups),
    canActivate:[AuthGuard]
  },
  {
    path:'groups/update/:id',
    loadComponent:()=>import('./shared/Group_shared_module/update-group/update-group').then(m=>m.UpdateGroup)
  },
  {
    path: 'groups/create',
    loadComponent:()=>import('./shared/Group_shared_module/create-group/create-group').then(m=>m.CreateGroup),
    canActivate:[AuthGuard]
  },
  {
    path: 'groups/:id',
    loadComponent:()=>import('./shared/Group_shared_module/group-details/group-details').then(m=>m.GroupDetails),
    canActivate:[AuthGuard]
  },

    {
    path:'tasks/personal_details',
    loadComponent:()=>import('./shared/task_shared_module/personal-assigned-task/personal-assigned-task').then(m=>m.PersonalAssignedTaskComponent),
    canActivate:[AuthGuard]
  },
  {
    path:'tasks/create-self-task',
    loadComponent:()=>import('./shared/task_shared_module/create-self-task/create-self-task').then(m=>m.CreateSelfTask),
    canActivate:[AuthGuard]
  },

  {
    path:'tasks/task-sheet',
    loadComponent:()=>import('./shared/task_shared_module/task-sheet-file/task-sheet-file').then(m=>m.TaskSheetFile),
    canActivate:[AuthGuard]
  },

  {
    path:'tasks/self-tasks',
    loadComponent:()=>import('./shared/task_shared_module/self-task-details/self-task-details').then(m=>m.SelfTaskDetails),
    canActivate:[AuthGuard]
  },
  {
    path:'tasks/personal',
    loadComponent:()=>import('./shared/task_shared_module/create-personal-task/create-personal-task').then(m=>m.CreatePersonalTask),
    canActivate:[AuthGuard]
  },

  {
    path:'tasks/:taskId',
    loadComponent:()=>import('./shared/task_shared_module/task-details/task-details').then(m=>m.TaskDetails),
    canActivate:[AuthGuard]
  },

  {
    path:'tasks/create_group_task/:groupId',
    loadComponent:()=>import('./features/Employee/task/create-group-task/create-group-task').then(m=>m.CreateGroupTask
    ),
    canActivate:[AuthGuard]
  },

  {
    path:'notification/employeeNotifications',
    loadComponent:()=>import('./shared/Notification_shared_module/notification-details/notification-details').then(m=>m.NotificationDetails),
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
