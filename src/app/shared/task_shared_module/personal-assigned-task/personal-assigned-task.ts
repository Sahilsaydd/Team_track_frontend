import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Task } from '../../../core/services/task';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './personal-assigned-task.html',
  styleUrls: ['./personal-assigned-task.css']
})
export class PersonalAssignedTaskComponent implements OnInit {
  private readonly loggedTasksStorageKey = 'personal_assigned_logged_task_ids';
  selectedLogTask: any = null;
  logModal: any;
  loggedTaskIds = new Set<number>(this.readLoggedTaskIds());
  taskLog = {
    task_id: 0,
    work_note: '',
    hours_spent: 0
  };
  selectedFile: File | null = null;
  selectedTask: any = null;
  evidenceData = {
    description: ''
  };

  screenshotFile: File | null = null;
  documentFile: File | null = null;
  tasks: any[] = [];

  selectedTaskReviews: any[] = [];
  selectedTaskForReview: any = null;

  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 5;

  get totalPages(): number {
    return Math.ceil(this.tasks.length / this.itemsPerPage);
  }

  get paginatedTasks(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.tasks.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get currentStart(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get currentEnd(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.tasks.length);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  constructor(private taskService: Task, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadTasks();
    this.cdr.detectChanges()
  }

  loadTasks(): void {
    this.taskService.getPersonalAssignedTasks().subscribe({
      next: (res) => {
        this.tasks = (res ?? []).map((task: any) => ({
          ...task,
          is_logged: task.is_logged ?? task.logged ?? task.has_log ?? false,
        }));
        console.log('Tasks:', this.tasks);
        this.cdr.detectChanges()
      },
      error: (err) => {
        console.error('Error loading tasks', err);
      }
    });
  }


  viewTask(task: any) {
    this.selectedTask = task;
  }

  viewReviews(task: any) {
    if (this.selectedTaskForReview?.id === task.id) {
      this.selectedTaskForReview = null;
      this.selectedTaskReviews = [];
      return;
    }

    this.selectedTaskForReview = task;
    this.selectedTaskReviews = [];
    this.taskService.getEmployeeTaskReviewsById(task.id).subscribe({
      next: (res: any) => {
        this.selectedTaskReviews = Array.isArray(res) ? res : [res];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching reviews', err);
        this.selectedTaskReviews = [];
      }
    });
  }

  openSubmitModal(task: any) {
    this.selectedTask = task;
    this.selectedFile = null;
    this.screenshotFile = null;
    this.documentFile = null;
    this.evidenceData.description = '';
  }
  onScreenshotSelect(event: any) {
    this.screenshotFile = event.target.files?.[0] ?? null;
  }
  onFileSelect(event: any) {
    this.documentFile = event.target.files?.[0] ?? null;
  }

  submitTaskWithEvidence() {

    const taskId = this.selectedTask.id;

    const formData = new FormData();


    formData.append('description', this.evidenceData.description);


    if (this.screenshotFile) {
      formData.append('screenshot', this.screenshotFile);
    }


    if (this.documentFile) {
      formData.append('file', this.documentFile);
    }

    this.taskService.uploadEvidence(taskId, formData).subscribe({
      next: (res) => {

        this.taskService.submitTask(taskId).subscribe({
          next: () => {
            this.selectedTask.status = 'submitted';
            this.closeSubmitModal();
            this.loadTasks();
            alert("Task submitted successfully!");
            this.cdr.detectChanges()
          },
          error: (err) => console.error(err)
        });

      },
      error: (err) => console.error(err)
    });
  }

  private closeSubmitModal(): void {
    const modalElement = document.getElementById('submitTaskModal');
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

    const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
    modalInstance.hide();
  }

  openLogModal(task: any) {

    this.selectedLogTask = task;

    this.taskLog = {
      task_id: task.id,
      work_note: '',
      hours_spent: 0
    };

    const modalEl = document.getElementById('taskLogModal');

    if (modalEl) {
      this.logModal = bootstrap.Modal.getOrCreateInstance(modalEl);
      this.logModal.show();
    }
  }

  submitTaskLog() {

    this.taskService.addTaskLog(this.taskLog).subscribe({

      next: () => {
        this.selectedLogTask.is_logged = true;
        this.loggedTaskIds.add(Number(this.taskLog.task_id));
        this.persistLoggedTaskIds();
        if (this.selectedLogTask) {
          this.selectedLogTask.is_logged = true;
        }

        if (this.logModal) {
          this.logModal.hide();
        }

        this.loadTasks();

      },

      error: (err)=>{
        if(err.status === 400 && err.error?.detail === "You have already logged this task"){
          this.selectedLogTask.is_logged =true;
          this.loggedTaskIds.add(Number(this.taskLog.task_id))
          this.persistLoggedTaskIds();
          if(this.logModal){
            this.logModal.hide()

          }

          this.loadTasks();

        }else{
          console.error(err)
        }
      }

    });

  }

  isTaskLogged(task: any): boolean {
    return Boolean(task?.is_logged || this.loggedTaskIds.has(Number(task?.id)));
  }

  private readLoggedTaskIds(): number[] {
    try {
      const raw = localStorage.getItem(this.loggedTasksStorageKey);
      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map((id) => Number(id)).filter((id) => !Number.isNaN(id)) : [];
    } catch {
      return [];
    }
  }

  private persistLoggedTaskIds(): void {
    localStorage.setItem(
      this.loggedTasksStorageKey,
      JSON.stringify(Array.from(this.loggedTaskIds))
    );
  }
}
