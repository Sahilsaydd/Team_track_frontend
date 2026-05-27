import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppUser, User } from '../../../../core/services/user';

@Component({
  selector: 'app-all-user',
  imports: [CommonModule, FormsModule],
  templateUrl: './all-user.html',
  styleUrl: './all-user.css',
})
export class AllUser implements OnInit {

  users: AppUser[] = [];
  filteredUsers: AppUser[] = [];
  loading = true;
  errorMessage = '';
  totalUsers = 0;
  activeUsers = 0;
  inactiveUsers = 0;
  superAdmins = 0;
  admins = 0;
  employees = 0;
  searchTerm = '';
  selectedRole = 'All';
  selectedStatus = 'All';
  currentPage = 1;
  pageSize = 10;

  constructor(private user: User ,  private cdr:ChangeDetectorRef) {}

  // Fetch all users on component initialization
  ngOnInit(): void {
    this.user.getAllUsers().subscribe({
      next: (response) => {
        this.users = response;
        this.updateStats();
        this.applyFilters();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Unable to load users.';
        this.loading = false;
        this.cdr.detectChanges();
      }

    });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredUsers.length / this.pageSize));
  }

  get showingStart(): number {
    return this.filteredUsers.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get showingEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredUsers.length);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  get pagedUsers(): AppUser[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }

    this.currentPage = page;
  }

  private updateStats(): void {
    this.totalUsers = this.users.length;
    this.activeUsers = this.users.filter((user) => user.is_active).length;
    this.inactiveUsers = this.users.filter((user) => !user.is_active).length;
    this.superAdmins = this.users.filter((user) => user.role === 'SuperAdmin').length;
    this.admins = this.users.filter((user) => user.role === 'Admin').length;
    this.employees = this.users.filter((user) => user.role === 'Employee').length;
  }

  private applyFilters(): void {
    const term = this.searchTerm.trim().toLowerCase();

    this.filteredUsers = this.users.filter((user) => {
      const matchesSearch =
        !term ||
        user.username.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term);

      const matchesRole =
        this.selectedRole === 'All' || user.role === this.selectedRole;

      const matchesStatus =
        this.selectedStatus === 'All' ||
        (this.selectedStatus === 'Active' && user.is_active) ||
        (this.selectedStatus === 'Inactive' && !user.is_active);

      return matchesSearch && matchesRole && matchesStatus;
    });

    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }


  // Based on the joined date, calculate how long ago the user joined in a human-readable format
  getJoninedAgo(joinedAt: string): string{
    const joinedDate = new Date(joinedAt);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - joinedDate.getTime()) / 1000);

    if (diffInSeconds < 60){
      return `${diffInSeconds} Seconds experience`;

    } else if (diffInSeconds < 3600){
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} Minutes experience`;

    } else if (diffInSeconds < 86400){
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} Hours experience`;

    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} Days experience`;
    }
  }
}
