import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { Task } from '../../../core/services/task';
import { User } from '../../../core/services/user';

@Component({
  selector: 'app-create-personal-task',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule
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

  readonly today = this.getTodayDate();

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

  private getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
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

    const role = sessionStorage.getItem('role');
    const userObservable = role === 'SuperAdmin' 
      ? this.userService.getAllAdmins() 
      : this.userService.getAllEmployees();

    userObservable.subscribe({
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

    if (this.task.deadline < this.today) {
      alert('Deadline cannot be in the past.');
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
