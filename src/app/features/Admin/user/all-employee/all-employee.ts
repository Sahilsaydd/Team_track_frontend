import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { AppUser, User } from '../../../../core/services/user';

type EmployeeStatusFilter = 'All' | 'Active' | 'Inactive';

@Component({
  selector: 'app-all-employee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-employee.html',
  styleUrl: './all-employee.css',
})
export class AllEmployee implements OnInit {
  employees: AppUser[] = [];
  loading = false;
  errorMessage = '';
  actionLoadingId: number | null = null;
  searchTerm = '';
  selectedStatus: EmployeeStatusFilter = 'All';

  currentPage = 1;
  pageSize = 8;

  constructor(private user: User, private router: Router , private cdr:ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.cdr.detectChanges();
  }

  loadEmployees(): void {
    this.loading = true;
    this.errorMessage = '';

    this.user.getAllEmployees().subscribe({
      next: (employees) => {
        this.employees = employees ?? [];
        this.loading = false;
        this.currentPage = 1;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Unable to load employees right now. Please try again.';
      },
    });
  }

  get filteredEmployees(): AppUser[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.employees.filter((employee) => {
      const matchesSearch =
        !term ||
        employee.username?.toLowerCase().includes(term) ||
        employee.email?.toLowerCase().includes(term) ||
        employee.role?.toLowerCase().includes(term);

      const isActive = employee.is_active === true;
      const matchesStatus =
        this.selectedStatus === 'All' ||
        (this.selectedStatus === 'Active' && isActive) ||
        (this.selectedStatus === 'Inactive' && !isActive);
        

      return matchesSearch && matchesStatus;
    });
  }

  get totalEmployees(): number {
    return this.employees.length;
  }

  get activeEmployees(): number {
    return this.employees.filter((employee) => employee.is_active).length;
  }

  get inactiveEmployees(): number {
    return this.employees.filter((employee) => !employee.is_active).length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredEmployees.length / this.pageSize));
  }

  get pagedEmployees(): AppUser[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredEmployees.slice(start, start + this.pageSize);
  }

  get showingFrom(): number {
    if (!this.filteredEmployees.length) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get showingTo(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredEmployees.length);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage += 1;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i += 1) {
      pages.push(i);
    }
    return pages;
  }

  refreshView(): void {
    this.currentPage = 1;
  }

  onSearchChange(): void {
    this.refreshView();
  }

  onStatusChange(): void {
    this.refreshView();
  }

  trackByEmployeeId(index: number, employee: AppUser): number {
    return employee.id;
  }

  editEmployee(employee: AppUser): void {
    this.router.navigate(['/employees/create'], {
      state: { employee },
    });
  }

  openStatusConfirm(employee: AppUser): void {
    if (this.actionLoadingId !== null) {
      return;
    }

    const target = employee.is_active ? 'deactivate' : 'activate';
    const title = target === 'deactivate' ? 'Deactivate employee?' : 'Activate employee?';
    const text =
      target === 'deactivate'
        ? 'This employee will be marked inactive and lose active access.'
        : 'This employee will be re-enabled and regain active access.';

    Swal.fire({
      title,
      text,
      icon: target === 'deactivate' ? 'warning' : 'question',
      showCancelButton: true,
      confirmButtonText: target === 'deactivate' ? 'Yes, deactivate' : 'Yes, activate',
      cancelButtonText: 'Cancel',
      confirmButtonColor: target === 'deactivate' ? '#dc3545' : '#198754',
      cancelButtonColor: '#e2e8f0',
      reverseButtons: true,
      showClass: {
        popup: 'swal2-show',
      },
      hideClass: {
        popup: 'swal2-hide',
      },
      customClass: {
        popup: 'employee-swal-popup',
        title: 'employee-swal-title',
        htmlContainer: 'employee-swal-text',
        actions: 'employee-swal-actions',
        confirmButton: 'employee-swal-confirm',
        cancelButton: 'employee-swal-cancel',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.confirmToggleEmployeeStatus(employee);
      }
    });
  }

  confirmToggleEmployeeStatus(employee: AppUser): void {
    this.actionLoadingId = employee.id;
    this.errorMessage = '';

    const request$ = employee.is_active
      ? this.user.deactivateEmployee(employee.id)
      : this.user.activateEmployee(employee.id);

    request$.subscribe({
      next: () => {
        employee.is_active = !employee.is_active;
        this.actionLoadingId = null;
        this.cdr.detectChanges();
      },
      error: () => {
        this.actionLoadingId = null;
        this.errorMessage = employee.is_active
          ? 'Unable to deactivate this employee right now.'
          : 'Unable to activate this employee right now.';
        this.cdr.detectChanges();
      },
    });
  }

  deleteEmployee(employee: AppUser): void {
    const confirmed = window.confirm(`Delete ${employee.username}?`);
    if (!confirmed) {
      return;
    }

    this.employees = this.employees.filter((item) => item.id !== employee.id);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
  }
}
