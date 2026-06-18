import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Task } from '../../../core/services/task';
import { ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-details.html',
  styleUrl: './task-details.css',
})
export class TaskDetails implements OnInit {

  taskId!: number;

  task: any = {};

  selectedStatus = '';

  constructor(
    private taskService: Task,
    private route: ActivatedRoute,
    private cdr:ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.taskId = Number(
      this.route.snapshot.paramMap.get('taskId')

    );

    this.loadTask(this.taskId);
    this.cdr.detectChanges();
  }

  loadTask(taskId: number): void {

    this.taskService
      .get_task_details(taskId)
      .subscribe({

        next: (data: any) => {

          this.task = data;

          this.selectedStatus = data.status;
          this.cdr.detectChanges()
          console.log('Task Data:', this.task);
        },

        error: (err) => {
          console.error(err);
        }

      });
  }

   updateStatus(): void {
    const payload = {
      status: this.selectedStatus
    };

    // show confirmation dialog with the selected status value
    Swal.fire({
      title: 'Confirm status change',
      text: `Change status to "${this.selectedStatus}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, change it',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.taskService
          .updateTaskStatus(this.taskId, payload.status)
          .subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Task status updated successfully'
              });
              this.loadTask(this.taskId);
            },
            error: (err) => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err?.error?.detail || 'Failed to update status'
              });
            }
          });
      }
    });
   }
}
