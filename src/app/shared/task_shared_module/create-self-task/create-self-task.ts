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

constructor(
private taskService: Task,
private router: Router
) {}

createTask(): void {


if (!this.taskData.title.trim()) {
  alert('Title is required');
  return;
}

this.isSubmitting = true;

this.taskService.createSelfTask(this.taskData)
  .subscribe({

    next: (res) => {

      console.log(res);

      alert('Self Task Created Successfully');

      this.router.navigate(['/employee']);
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
