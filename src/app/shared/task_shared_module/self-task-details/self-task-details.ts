import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Task } from '../../../core/services/task';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

declare const bootstrap: any;

@Component({
  selector: 'app-self-task-details',
  imports: [CommonModule,FormsModule],
  templateUrl: './self-task-details.html',
  styleUrl: './self-task-details.css',
})
export class SelfTaskDetails implements OnInit {

  tasks:any[]= []
  selectedTask:any  =null
  loggedTaskIds = new Set<number>();
  logData = {
  task_id: 0,
  work_note: '',
  hours_spent: 0
};

isSubmittingLog = false;
  constructor(private taskService:Task, private cdr:ChangeDetectorRef){}

  ngOnInit(): void {
 this.loadSelfTaskDetails()
 this.cdr.detectChanges()
  }

  loadSelfTaskDetails():void{
    this.taskService.getSelfAllTask().subscribe({
      next:(data)=>{
        this.tasks = (data ?? []).map((task: any) => ({
          ...task,
          is_logged: task.is_logged ?? task.logged ?? task.has_log ?? false
        }));
        console.log(this.tasks)
        this.cdr.detectChanges()
      },
      error: (err)=>{
        console.error(err)
      }
    })
  }

  viewTask(task:any): void{
    this.selectedTask =task
  }


  completeTask(task: any): void {
    Swal.fire({
      title: '<i class="fas fa-circle-question me-2 text-warning"></i>Complete this task?',
      text: 'Are you sure you want to mark this task as completed?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '<i class="fas fa-check me-2"></i>Yes, complete it',
      cancelButtonText: '<i class="fas fa-times me-2"></i>Cancel',
      confirmButtonColor: '#198754',
      cancelButtonColor: '#6c757d',
      reverseButtons: true,
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.taskService.updateTaskStatus(task.id, 'completed').subscribe({
        next: (data) => {
          console.log(data);
          task.status = 'completed';
          this.cdr.detectChanges();

          Swal.fire({
            icon: 'success',
            title: '<i class="fas fa-check-circle me-2 text-success"></i>Task completed',
            text: 'Task status updated successfully',
            confirmButtonText: 'Great',
          });
        },
        error: (err) => {
          console.error(err);
          Swal.fire({
            icon: 'error',
            title: '<i class="fas fa-circle-exclamation me-2 text-danger"></i>Unable to update',
            text: err?.error?.detail || 'Failed to update task status',
            confirmButtonText: 'Try again',
          });
        },
      });
    });
  }


  openLogModal(task: any): void {

  this.selectedTask = task;

  this.logData = {
    task_id: task.id,
    work_note: '',
    hours_spent: 0
  };

}

  private closeLogModal(): void {
    const modalElement = document.getElementById('logTaskModal');
    if (!modalElement) {
      return;
    }

    const cleanupBackdrop = () => {
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('padding-right');
      document.querySelectorAll('.modal-backdrop').forEach((backdrop) => backdrop.remove());
      modalElement.removeEventListener('hidden.bs.modal', cleanupBackdrop);
    };

    modalElement.addEventListener('hidden.bs.modal', cleanupBackdrop);

    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    modal.hide();
  }

submitTaskLog(): void {

  if (!this.logData.work_note.trim()) {

    Swal.fire({
      icon: 'warning',
      title: 'Work Note Required',
      text: 'Please enter work note'
    });

    return;
  }

  if (this.logData.hours_spent <= 0) {

    Swal.fire({
      icon: 'warning',
      title: 'Invalid Hours',
      text: 'Hours spent must be greater than 0'
    });

    return;
  }

  this.isSubmittingLog = true;

  this.taskService.addTaskLog(this.logData)
    .subscribe({

      next: (res) => {

        console.log(res);

        this.isSubmittingLog = false;
        this.loggedTaskIds.add(Number(this.logData.task_id));
        if (this.selectedTask) {
          this.selectedTask.is_logged = true;
        }

        Swal.fire({
          icon: 'success',
          title: 'Task Log Added',
          text: 'Task log submitted successfully'
        });

        this.closeLogModal();
        this.cdr.detectChanges();

        this.logData = {
          task_id: 0,
          work_note: '',
          hours_spent: 0
        };

      },

      error: (err) => {

        console.error(err);

        this.isSubmittingLog = false;

        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: err?.error?.detail || 'Unable to add task log'
        });

      }

    });

}

  isTaskLogged(task: any): boolean {
    return Boolean(task?.is_logged || this.loggedTaskIds.has(Number(task?.id)));
  }
}
