import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from '../../../../core/services/user';

@Component({
  selector: 'app-create-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-admin.html',
  styleUrl: './create-admin.css',
})
export class CreateAdmin {
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

  constructor(private user: User, private router: Router) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  createAdmin(form: NgForm): void {
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

    this.user.createAdmin({
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
        this.successMessage = 'Admin created successfully.';
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
        this.errorMessage = error?.error?.detail || 'Unable to create admin.';
      },
    });
  }

  closeSuccessAndGoToUsers(): void {
    this.showSuccessModal = false;
    this.router.navigateByUrl('/users');
  }

  cancelConfirm(): void {
    this.showConfirmModal = false;
  }
}
