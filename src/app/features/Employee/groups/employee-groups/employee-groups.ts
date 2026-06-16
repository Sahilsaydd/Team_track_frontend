import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Group } from '../../../../core/services/group';
import { Router } from '@angular/router';

export interface EmployeeGroup {
  id: number;
  name: string;
  description: string;
  group_code: string;
  profile_pic: string;
  is_active: boolean;
  created_at?: string | Date;
}

@Component({
  selector: 'app-employee-groups',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './employee-groups.html',
  styleUrls: ['./employee-groups.css'],
})
export class EmployeeGroups implements OnInit {

  employee_group: EmployeeGroup[] = [];

  searchTerm = '';
  filterStatus = 'all';

  get filteredGroups(): EmployeeGroup[] {
    const term = this.searchTerm?.trim().toLowerCase();
    return this.employee_group.filter(g => {
      // filter by status
      if (this.filterStatus === 'active' && !g.is_active) return false;
      if (this.filterStatus === 'inactive' && g.is_active) return false;

      // filter by search term
      if (!term) return true;

      const hay = (g.name + ' ' + g.description + ' ' + g.group_code).toLowerCase();
      return hay.indexOf(term) !== -1;
    });
  }

  get activeCount(): number {
    return this.employee_group.filter(g => !!g.is_active).length;
  }

  formatDate(value?: string | Date) {
    if (!value) return '';
    const d = typeof value === 'string' ? new Date(value) : value;
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString();
  }

  constructor(
    private groupServices: Group,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.get_emp_AllGroup();
  }

  get_emp_AllGroup() {
    this.groupServices.getMyGroups().subscribe({
      next: (data: EmployeeGroup[]) => {
        this.employee_group = data;
        this.cdr.detectChanges();
      }
    });
  }

  private apiUrl = 'http://localhost:8000';

getImageUrl(path: string) {
  if (!path) {
    return 'assets/default-group.png';
  }

  if (path.startsWith('http')) {
    return path;
  }

  return `${this.apiUrl}/${path}`;
}

  viewGroup(id: number) {
    this.router.navigate(['/groups', id]);
  }
}
