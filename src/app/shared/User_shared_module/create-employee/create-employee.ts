import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from '../../../core/services/user';
import { RoleService } from '../../../core/services/role.service';

@Component({
  selector: 'app-create-employee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-employee.html',
  styleUrl: './create-employee.css',
})
export class CreateEmployee {
  loading = false;
  successMessage = '';
  errorMessage = '';
  showPassword = false;
  showConfirmPassword = false;
  showConfirmModal = false;
  showSuccessModal = false;
  mismatchError = '';
  createdUser: { username: string; email: string } | null = null;

  formData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  constructor(
    private user: User,
    private router: Router,
    private roleService: RoleService
  ) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  createEmployee(form: NgForm): void {
    console.log('Form data:', this.formData); // Debug log
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.formData.password !== this.formData.confirmPassword) {
      this.mismatchError = 'Password and confirm password must match.';
      return;
    }

    this.mismatchError = '';
    this.showConfirmModal = true;
  }

  confirmCreate(form: NgForm): void {
    this.showConfirmModal = false;
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.user.createEmployee({
      username: this.formData.username,
      email: this.formData.email,
      password: this.formData.confirmPassword,
    }).subscribe({
      next: () => {
        this.loading = false;
        this.createdUser = {
          username: this.formData.username,
          email: this.formData.email,
        };
        this.showSuccessModal = true;
        this.successMessage = 'Employee created successfully.';
        form.resetForm();
        this.formData = {
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        };
        this.showPassword = false;
        this.showConfirmPassword = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error?.error?.detail || 'Unable to create employee.';
      },
    });
  }

  closeSuccessAndGoBack(): void {
    this.showSuccessModal = false;
    // Here have the one condition is that when superadmin created then navigate to users and when admin is created then navigate to all employees page
    const role = sessionStorage.getItem('role');
    if(role === 'SuperAdmin'){
      this.router.navigate(['/users']);

    }
    else if(role === 'Admin'){
      this.router.navigate(['/employees']);
    }
  }

  cancelConfirm(): void {
    this.showConfirmModal = false;
  }
}
