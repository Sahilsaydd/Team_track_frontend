import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';

import { Task } from '../../../core/services/task';
import { User } from '../../../core/services/user';

@Component({
  selector: 'app-create-personal-task',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectComponent
  ],
  templateUrl: './create-personal-task.html',
  styleUrl: './create-personal-task.css'
})
export class CreatePersonalTask implements OnInit {

  users: any[] = [];

  filteredUsers: any[] = [];

  employeeSearchText = '';

  isLoadingUsers = false;

  isSubmitting = false;

  task = {
    title: '',
    description: '',
    priority: '',
    deadline: '',
    assigned_to: null as number | null
  };

  constructor(
    private taskService: Task,
    private userService: User
  ) {}

  ngOnInit(): void {
    this.loadAssignableUsers();
  }

  filterUsers(): void {
    const query = this.employeeSearchText.trim().toLowerCase();

    if (!query) {
      this.filteredUsers = [...this.users];
      return;
    }

    this.filteredUsers = this.users.filter((user: any) => {
      const username = user?.username?.toLowerCase() || '';
      const email = user?.email?.toLowerCase() || '';
      const role = user?.role?.toLowerCase() || '';

      return username.includes(query) || email.includes(query) || role.includes(query);
    });
  }

  selectSuggestedUser(user: any): void {
    this.task.assigned_to = user?.id ?? null;
    this.employeeSearchText = user?.username || '';
    this.filteredUsers = [user];
  }

  loadAssignableUsers(): void {

  this.isLoadingUsers = true;

  this.userService.getAllAdmins().subscribe({

    next: (response: any[]) => {

      this.users = response;

      this.isLoadingUsers = false;

    },

    error: (err: any) => {

      console.error(err);

      this.isLoadingUsers = false;

      alert('Unable to load users.');

    }

  });

}

  submitTask(form: NgForm): void {

    if (form.invalid) {

      form.control.markAllAsTouched();

      return;

    }

    this.isSubmitting = true;

    this.taskService.createPersonalTask(this.task).subscribe({

      next: (response: any) => {

        alert(response.message);

        form.resetForm();

        this.task = {

          title: '',

          description: '',

          priority: '',

          deadline: '',

          assigned_to: null

        };

        this.isSubmitting = false;

      },

      error: (err: any) => {

        console.error(err);

        alert(err?.error?.detail || "Something went wrong.");

        this.isSubmitting = false;

      }

    });

  }

}
