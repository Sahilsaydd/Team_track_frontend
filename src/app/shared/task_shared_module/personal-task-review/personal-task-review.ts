import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../../core/services/task';

@Component({
  selector: 'app-personal-task-review',
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './personal-task-review.html',
  styleUrls: ['./personal-task-review.css'],
})
export class PersonalTaskReview implements OnInit {

  tasks: any[] = [];
  evidenceList: any[] = [];
  selectedTaskId!: number;
  selectedTask: any = null;
  reviewComment: string = '';
  reviewStatus: string = '';

  get latestEvidence(): any {
    return this.evidenceList && this.evidenceList.length > 0 
      ? this.evidenceList[0] 
      : null;
  }

  selectedImageUrl: string = '';

  constructor(private taskService: Task, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadReviewTasks();
  }

  // 1 LOAD TASKS FOR REVIEW (SuperAdmin / Admin)
  loadReviewTasks() {
    this.taskService.getPersonalTasksForReview().subscribe({
      next: (res: any) => {
        this.tasks = res;
        console.log('Review Tasks:', res);
        this.cdr.detectChanges()
      },
      error: (err) => {
        console.error('Error loading review tasks', err);
      }
    });
  }

  // 2️ LOAD EVIDENCE FOR SELECTED TASK
  loadUploadedEvidence(taskId: number) {
    this.selectedTaskId = taskId;

    this.taskService.getTaskEvidence(taskId).subscribe({
      next: (res: any) => {
        this.evidenceList = res;
        console.log('Evidence:', res);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading evidence', err);
      }
    });
  }

  openReviewModal(task: any) {
    this.selectedTask = task;
    this.reviewComment = '';
    this.reviewStatus = '';

    this.loadUploadedEvidence(task.id);

    const modalElement = document.getElementById('reviewModal');
    if (!modalElement) {
      return;
    }

    // Open Bootstrap modal
    const modal = (window as any).bootstrap.Modal.getOrCreateInstance(modalElement);
    modal.show();
  }

  submitReview() {
    if (!this.selectedTask || !this.reviewStatus) return;

    const payload = {
      review_status: this.reviewStatus,
      comment: this.reviewComment
    };

    this.taskService.reviewTask(this.selectedTask.id, payload).subscribe({
      next: (res: any) => {
        console.log('Review submitted successfully', res);
        
        // Hide modal and clean up any leftover backdrop state
        const modalElement = document.getElementById('reviewModal');
        if (modalElement) {
          const modalInstance = (window as any).bootstrap.Modal.getOrCreateInstance(modalElement);
          const cleanupBackdrop = () => {
            document.body.classList.remove('modal-open');
            document.body.style.removeProperty('padding-right');
            document.querySelectorAll('.modal-backdrop').forEach((backdrop) => backdrop.remove());
            modalElement.removeEventListener('hidden.bs.modal', cleanupBackdrop);
          };

          modalElement.addEventListener('hidden.bs.modal', cleanupBackdrop);
          modalInstance.hide();
        }
        
        // Reload tasks to reflect changes
        this.loadReviewTasks();
      },
      error: (err) => {
        console.error('Error submitting review', err);
      }
    });
  }

  viewImage(imagePath: string) {
    if (!imagePath) return;
    
    // Construct full URL (assuming backend is at localhost:8000)
    this.selectedImageUrl = 'http://localhost:8000/' + imagePath;
    
    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('imageModal')
    );
    modal.show();
  }
}
