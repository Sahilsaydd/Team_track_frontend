import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Task } from '../../../core/services/task';

@Component({
selector: 'app-create-self-task',
standalone: true,
imports: [
CommonModule,
FormsModule
],
templateUrl: './create-self-task.html',
styleUrl: './create-self-task.css'
})
export class CreateSelfTask {

taskData = {
title: '',
description: '',
priority: 'medium',
deadline: ''
};

isSubmitting = false;
readonly minDeadline = this.getMinDeadline();

constructor(
private taskService: Task,
private router: Router
) {}

private getMinDeadline(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

createTask(): void {


if (!this.taskData.title.trim()) {
  alert('Title is required');
  return;
}

if (!this.taskData.deadline) {
  alert('Deadline is required');
  return;
}

if (this.taskData.deadline < this.minDeadline) {
  alert('Deadline cannot be in the past');
  return;
}

this.isSubmitting = true;

this.taskService.createSelfTask(this.taskData)
  .subscribe({

    next: (res) => {

      console.log(res);

      alert('Self Task Created Successfully');

      this.router.navigate(['tasks/self-tasks']);
    },

    error: (err) => {

      console.error(err);

      alert(
        err?.error?.detail ||
        'Unable to create self task'
      );

      this.isSubmitting = false;
    }
  });


}
}
