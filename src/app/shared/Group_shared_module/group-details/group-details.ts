import {
  Component,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Group } from '../../../core/services/group';
import { Task } from '../../../core/services/task';
import { User } from '../../../core/services/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-group-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './group-details.html',
  styleUrl: './group-details.css',
})
export class GroupDetails implements OnInit {

  group_id!: number;

  group: any = {};
  members: any[] = [];
  tasks: any[] = [];
  notifications: any[] = [];
  employees: any[] = [];
selectedEmployees: any[] = [];
  showAddPanel = false;
  openMenuId: number | null = null;

  loading = true;
  isEmployee = false;

  constructor(
    private group_service: Group,
    private task_service: Task,
    private UserService:User,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.group_id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.loadGroupDetails();
    this.loadGroupMembers();
    this.loadGroupTasks();

    // Determine current user role from localStorage (common pattern in this app)
    try {
      const raw = sessionStorage.getItem('currentUser') || sessionStorage.getItem('user') || null;
      const normalize = (v: any) => (v || '').toString().toLowerCase();
      if (raw) {
        const u = JSON.parse(raw);
        const roleVal = normalize(u.role || u.user?.role || u?.data?.role);
        this.isEmployee = roleVal === 'employee';
      } else {
        const role = normalize(sessionStorage.getItem('role'));
        this.isEmployee = role === 'employee';
      }
    } catch (e) {
      this.isEmployee = false;
    }

    if(!this.isEmployee){
     this.loadEmployees();
    }

    console.log('Current User:', sessionStorage.getItem('currentUser'));
console.log('User:', sessionStorage.getItem('user'));
console.log('Role:', sessionStorage.getItem('role'));
console.log('isEmployee:', this.isEmployee);
  }

  toggleAddPanel(): void {
    this.showAddPanel = !this.showAddPanel;
  }

  toggleMemberMenu(id: number): void {
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  closeMemberMenu(): void {
    this.openMenuId = null;
  }

  addSelectedMembers(): void {
    if (!this.selectedEmployees.length) {
      Swal.fire({ icon: 'info', title: 'No members selected', text: 'Please select at least one employee to add.' });
      return;
    }

    Swal.fire({
      title: 'Confirm add members',
      html: `Add ${this.selectedEmployees.length} member(s) to this group?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, add',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = {
          group_id: this.group_id,
          members: this.selectedEmployees.map((e) => ({ user_id: e.id, role_in_group: 'Member' })),
        };

        this.group_service.addMembers(payload).subscribe({
          next: (res) => {
            Swal.fire({ icon: 'success', title: 'Members added', text: 'Selected employees were added to the group.' });
            this.selectedEmployees = [];
            this.showAddPanel = false;
            this.loadGroupMembers();
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Add members error', err);
            Swal.fire({ icon: 'error', title: 'Unable to add members', text: err?.error?.detail || 'An error occurred.' });
          },
        });
      }
    });
  }

  loadGroupDetails(): void {

    this.group_service
      .get_group_by_id(this.group_id)
      .subscribe({
        next: (data) => {
          this.group = data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Group Details Error', err);
          // If backend denies access for non-admins, attempt to load group's basic info
          // from the employee's groups (fallback for Employee role).
          if (err?.status === 403 || (err?.error?.detail && String(err.error.detail).toLowerCase().includes('only superadmin'))) {
            this.group_service.getMyGroups().subscribe({
              next: (groups: any[]) => {
                const g = groups.find((x:any) => Number(x.id) === Number(this.group_id));
                if (g) {
                  this.group = g;
                  this.cdr.detectChanges();
                } else {
                  console.warn('Group not found in user groups fallback');
                }
              },
              error: (e) => {
                console.error('Fallback groups load failed', e);
              }
            });
          }
        },
      });
  }

  loadGroupMembers(): void {

    this.group_service
      .get_group_members(this.group_id)
      .subscribe({
        next: (data: any) => {
          // API may return either an array or an object { members: [...], leader: {...} }
          if (!data) {
            this.members = [];
          } else if (Array.isArray(data)) {
            this.members = data;
          } else if (data.members && Array.isArray(data.members)) {
            this.members = data.members;
            (this as any).leader = data.leader ?? null;
          } else {
            this.members = [];
          }

          this.members = this.members ?? [];
          // reload available employees list so add-panel excludes current members
          if(!this.isEmployee){
            this.loadEmployees()
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Members Error', err);
        },
      });
  }

  loadGroupTasks(): void {

    this.task_service
      .get_group_task()
      .subscribe({
        next: (data: any) => {
          this.tasks = data ?? [];
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.loading = false;
          console.error('Tasks Error', err);
        },
      });
  }

  get leadCount(): number {

    return this.members.filter(
      (member) => member.role_in_group === 'Lead'
    ).length;
  }

  get activeMembers(): number {

    return this.members.filter(
      (member) => member.is_active
    ).length;
  }

  getImageUrl(path: string | null | undefined): string {

    if (!path) {
      return 'assets/default-group.png';
    }

    if (
      path.startsWith('http') ||
      path.startsWith('//')
    ) {
      return path;
    }

    return `http://localhost:8000/${path}`;
  }

  getInitials(name?: string): string {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0,2).toUpperCase();
    return (parts[0][0] + (parts[1][0] || '')).slice(0,2).toUpperCase();
  }

  private escapeHtml(value: string): string {
    return (value || '')
      .toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }



loadEmployees(): void {

  this.UserService.getAllEmployees().subscribe({
    next: (data: any) => {

      const allEmployees = data ?? [];

      // Get all employee IDs already in group
      const memberUserIds = new Set(
        this.members.map(member => member.user_id)
      );

      // Show only employees NOT already in group
      this.employees = allEmployees.filter(
  (employee: any) =>
    employee.is_active &&
    !memberUserIds.has(employee.id)
);

      console.log('Group Member User IDs:', [...memberUserIds]);
      console.log('Available Employees:', this.employees);
    },

    error: (err) => {
      console.error('Load employees failed', err);
      this.employees = [];
    }
  });

}
  toggleEmployee(employee:any , event:any):void{
    if(event.target.checked){
      const exist =this.selectedEmployees.find(
        e=>e.id ===employee.id
      )

      if(!exist){
        this.selectedEmployees.push(employee)
      }

    }
    else{
      this.selectedEmployees =this.selectedEmployees.filter(e=>e.id !== employee.id)
    }
  }


  // remove members

  removeMember(member: any): void {

  Swal.fire({
    title: 'Remove Member?',
    text: `Are you sure you want to remove ${member.username} from this group?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Remove',
    cancelButtonText: 'Cancel',
  }).then((result) => {

    if (result.isConfirmed) {
      // Prevent removing the leader
      const role = (member.role_in_group || member.role || '').toString().toLowerCase();
      if (role === 'lead') {
        Swal.fire({ icon: 'error', title: 'Cannot remove leader', text: 'Please assign a new leader before removing this member.' });
        return;
      }

      const payload = {
        group_id: this.group_id,
        user_id: member.user_id || member.id || member.user?.id
      };

      this.group_service.removeMember(payload)
        .subscribe({
          next: (res: any) => {

            Swal.fire({
              icon: 'success',
              title: 'Removed',
              text: res.message
            });

            this.loadGroupMembers();

            if (!this.isEmployee) {
              this.loadEmployees();
            }

          },
          error: (err) => {

            console.error(err);

            Swal.fire({
              icon: 'error',
              title: 'Failed',
              text: err?.error?.detail || 'Unable to remove member'
            });

          }
        });

    }

  });

}

  changeLeader(member: any): void {
    Swal.fire({ icon: 'info', title: 'Change Leader', text: 'Change leader feature is not implemented yet.' });
  }

openChangeLeaderPopup(): void {

  const availableMembers = this.members.filter((m: any) => (m.role_in_group || m.role || '').toString().toLowerCase() !== 'lead');

  const listHtml = availableMembers
    .map((member: any) => {
      const id = member.user_id ?? member.id ?? member.user?.id;
      const initials = this.getInitials(member.username || member.name || '');
      return `
        <label class="change-leader-item d-flex align-items-center gap-3 p-2" style="display:flex;align-items:center;">
          <input type="radio" name="newLeader" value="${id}" style="margin-right:10px;" />
          <div style="width:36px;height:36px;border-radius:50%;background:#6c757d;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:600;">${initials}</div>
          <div style="margin-left:8px;text-align:left;">
            <div style="font-weight:600;">${this.escapeHtml(member.username || member.name || 'Unnamed')}</div>
            <div style="font-size:12px;color:#6c757d;">${this.escapeHtml(member.email || '')}</div>
          </div>
        </label>
      `;
    })
    .join('');

  Swal.fire({
    title: 'Select New Leader',
    html: `<div class="change-leader-list" style="max-height:320px;overflow:auto;text-align:left">${listHtml}</div>`,
    showCancelButton: true,
    confirmButtonText: 'Change Leader',
    width: 560,
    didOpen: () => {
      // ensure first item is focused
      const first = document.querySelector<HTMLInputElement>('.change-leader-list input[name="newLeader"]');
      if (first) (first as HTMLElement).focus();
    },
    preConfirm: () => {
      const el = document.querySelector<HTMLInputElement>('input[name="newLeader"]:checked');
      if (!el) {
        Swal.showValidationMessage('Please select a member to become leader');
        return null;
      }
      return Number(el.value);
    }
  }).then((result) => {
    if (!result.isConfirmed || !result.value) return;

    const payload = { group_id: this.group_id, new_leader_id: Number(result.value) };

    this.group_service.changeLeader(payload).subscribe({
      next: (res: any) => {
        Swal.fire({ icon: 'success', title: 'Success', text: res.message });
        this.loadGroupMembers();
      },
      error: (err) => {
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Failed', text: err?.error?.detail || 'Unable to change leader' });
      }
    });
  });

}
}
