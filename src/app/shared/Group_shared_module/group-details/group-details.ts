import {
  Component,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Group } from '../../../core/services/group';
import { Task } from '../../../core/services/task';

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

  loading = true;
  isEmployee = false;

  constructor(
    private group_service: Group,
    private task_service: Task,
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
      if (raw) {
        const u = JSON.parse(raw);
        this.isEmployee = (u.role || u.user?.role || '').toString() === 'Employee';
      } else {
        const role = sessionStorage.getItem('role');
        this.isEmployee = role === 'Employee';
      }
    } catch (e) {
      this.isEmployee = false;
    }

    console.log('Current User:', sessionStorage.getItem('currentUser'));
console.log('User:', sessionStorage.getItem('user'));
console.log('Role:', sessionStorage.getItem('role'));
console.log('isEmployee:', this.isEmployee);
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
}
