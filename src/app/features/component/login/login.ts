import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { Auth } from '../../../core/services/auth';
import { RoleService } from '../../../core/services/role.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {

  email: string = '';
  password: string = '';
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private auth: Auth,
    private router: Router,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {}

  login(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    const data = {
      email: this.email,
      password: this.password
    };

    this.auth.login(data).subscribe({
      next: (response: any) => {
        const role = response?.role || response?.user?.role;
        sessionStorage.setItem('token', response?.access_token ?? '');
        sessionStorage.setItem('role', role ?? '');
        sessionStorage.setItem('user', JSON.stringify(response?.user ?? null));

        // Push role into the observable so sidebar updates immediately
        this.roleService.setRole(role ?? '');

        this.loading = false;
        this.router.navigateByUrl('/');
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error?.error?.detail || 'Login Failed';
      }
    });
  }
}
