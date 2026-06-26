
export interface NavChild {
  label: string;
  icon: string;
  route: string;
}

export interface NavItem {
  label: string;
  icon: string;
  route?: string;
  children?: NavChild[];
}


export const SIDEBAR_NAV: Record<string, NavItem[]> = {


  SuperAdmin: [
    {
      label: 'Dashboard',
      icon: 'fa-solid fa-table-columns',
      route: '/superadmin'
    },
    {
      label: 'Users',
      icon: 'fa-solid fa-users',
      children: [
        { label: 'All Users', icon: 'fa-solid fa-user-group', route: '/users' },
        { label: 'Create Admin', icon: 'fa-solid fa-user-plus', route: '/users/create_admin' },
        { label: 'Create Employee', icon: 'fa-solid fa-user-plus', route: '/users/create_employee' },
      ]
    },
    {
      label: 'Groups',
      icon: 'fa-solid fa-people-group',
      children: [
        { label: 'All Groups', icon: 'fa-solid fa-layer-group', route: '/groups' },
        { label: 'Create Group', icon: 'fa-solid fa-folder-plus', route: '/groups/create' },

      ]
    },
    {
      label: 'Tasks',
      icon: 'fa-solid fa-clipboard-list',
      children: [
        { label: 'Personal Assigned Task', icon: 'fa-solid fa-clipboard-list', route: '/tasks/personal_details' },
        {label: 'Personal Task',icon: 'fa-solid fa-address-book',route:'/tasks/personal'},
        { label: 'Create Self Task', icon: 'fa-solid fa-folder-plus',route: '/tasks/create-self-task' },
        {label: 'All My Tasks' , icon : 'fa-solid fa-user-check',route:'tasks/self-tasks'},
        {
          label:'Task Sheet', icon: 'fa-solid fa-file-lines',route:'/tasks/task-sheet'
        }

      ]
    },

    {
      label: 'Notifications',
      icon: 'fa-solid fa-bell',
      route: '/notifications'
    },
    {
      label: 'Settings',
      icon: 'fa-solid fa-gear',
      route: '/settings'
    }
  ],

  // ─── Admin ───────────────────────────────────────────────
  Admin: [
    {
      label: 'Dashboard',
      icon: 'fa-solid fa-table-columns',
      route: '/admin'
    },
    {
      label: 'Users',
      icon: 'fa-solid fa-users',
      children: [
        { label: 'All Employees', icon: 'fa-solid fa-user-group', route: '/employees' },
        { label: 'Create Employee', icon: 'fa-solid fa-user-plus', route: '/users/create_employee' },
      ]
    },
    {
      label: 'Groups',
      icon: 'fa-solid fa-people-group',
      children: [
        { label: 'All Groups', icon: 'fa-solid fa-layer-group', route: '/groups' },
        { label: 'Create Group', icon: 'fa-solid fa-folder-plus', route: '/groups/create' },
      ]
    },
    {
      label: 'Tasks',
      icon: 'fa-solid fa-list-check',
      children: [
         { label: 'Personal Assigned Task', icon: 'fa-solid fa-clipboard-list', route: '/tasks/personal_details' },
        { label: 'Create Self Task', icon: 'fa-solid fa-folder-plus',route: '/tasks/create-self-task' },
        {label: 'All My Tasks' , icon : 'fa-solid fa-user-check',route:'tasks/self-tasks'},
         {
          label:'Task Sheet', icon: 'fa-solid fa-file-lines',route:'/tasks/task-sheet'
        }
      ]
    },
    {
      label: 'Notifications',
      icon: 'fa-solid fa-bell',
      route: '/notifications'
    },
    {
      label: 'Settings',
      icon: 'fa-solid fa-gear',
      route: '/settings'
    }
  ],



  // ─── User (Employee) ────────────────────────────────────
  Employee: [
    {
      label: 'Dashboard',
      icon: 'fa-solid fa-table-columns',
      route: '/employee'
    },
    {
      label: 'Groups',
      icon: 'fa-solid fa-list-check',
      children: [
        { label: 'My Groups', icon: 'fa-solid fa-clipboard-list', route: '/employee/employee_groups' },
      ]
    },

    {
      label: 'Tasks',
      icon: 'fa-solid fa-list-check',
      children:[
        { label: 'Create Self Task', icon: 'fa-solid fa-folder-plus',route: '/tasks/create-self-task' },
        {label: 'All My Self Tasks' , icon : 'fa-solid fa-user-check',route:'tasks/self-tasks'},
         {
          label:'Task Sheet', icon: 'fa-solid fa-file-lines',route:'/tasks/task-sheet'
        }

      ]
    },
    {
      label: 'Notifications',
      icon: 'fa-solid fa-bell',
      route: '/notifications'
    }
  ]
};
