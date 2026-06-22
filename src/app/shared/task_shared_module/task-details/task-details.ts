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
  taskReviews: any[] = [];
  evidences: any[]=[]
  isTaskAssigner =false
  reviewData={
    review_status :'approved',
    comment: ''
  }

  latestEvidence: any = null;

showEvidenceHistory = false;
  taskId!: number;

  task: any = {};

  selectedStatus = '';

  evidenceDescription = '';

selectedScreenshot: File | null = null;

selectedFile: File | null = null;
currentUserId!: number;
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
          const user = JSON.parse(sessionStorage.getItem('user') || '{}')
          this.currentUserId = user.id;
          this.isTaskAssigner =this.task.assigned_by  == this.currentUserId;
          if(this.isTaskAssigner){
               this.loadTaskEvidence();
          }
          this.loadTaskReviews()
          this.cdr.detectChanges()
          console.log('Task Data:', this.task);
        },

        error: (err) => {
          console.error(err);
        }

      });
  }

// Load uploded task evidence

loadTaskEvidence(): void {

  this.taskService.getTaskEvidence(this.taskId).subscribe({

    next: (data: any[]) => {

      this.evidences = Array.isArray(data) ? data : [];

      if (this.evidences.length > 0) {
        this.latestEvidence = this.evidences[0];
      } else {
        this.latestEvidence = null;
      }

      this.cdr.detectChanges();

    },

    error: (err) => {
      console.log(err);
      this.evidences = [];
      this.latestEvidence = null;
      this.cdr.detectChanges();
    }

  });

}


toggleEvidenceHistory(): void {

  this.showEvidenceHistory =
    !this.showEvidenceHistory;

}

submitReview(): void {

  this.taskService.reviewTask(this.taskId,this.reviewData).subscribe({

      next: (res) => {

        Swal.fire({
          icon: 'success',
          title: 'Review Submitted',
          text: 'Task reviewed successfully'
        });

        this.loadTask(this.taskId);
        this.cdr.detectChanges()
      },


      error: (err) => {

        Swal.fire({
          icon: 'error',
          title: 'Review Failed',
          text: err.error.detail
        });

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


   // upload evidence
   onScreenshotSelected(event: any): void {

  if (event.target.files.length > 0) {

    this.selectedScreenshot = event.target.files[0];

  }

}

onFileSelected(event: any): void {

  if (event.target.files.length > 0) {

    this.selectedFile = event.target.files[0];

  }

}

uploadEvidence(): void {

  const formData = new FormData();

  formData.append(
    'description',
    this.evidenceDescription
  );

  if (this.selectedScreenshot) {

    formData.append(
      'screenshot',
      this.selectedScreenshot
    );

  }

  if (this.selectedFile) {

    formData.append(
      'file',
      this.selectedFile
    );

  }

  this.taskService
    .uploadEvidence(
      this.taskId,
      formData
    )
    .subscribe({

      next: () => {

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Evidence uploaded successfully'
        });

        this.evidenceDescription = '';
        this.selectedScreenshot = null;
        this.selectedFile = null;
        this.loadTaskEvidence();

      },

      error: (err) => {

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.detail || 'Failed to upload evidence'
        });

      }

    });

}

  confirmUpload(): void {
    const validation = this.validateEvidence();
    if (!validation.valid) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation',
        text: validation.message
      });
      return;
    }

    Swal.fire({
      title: 'Confirm upload',
      text: 'Are you sure you want to upload this evidence?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, upload',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.uploadEvidence();
      }
    });
  }

  validateEvidence(): { valid: boolean; message?: string } {
    const descriptionPresent = (this.evidenceDescription || '').trim().length > 0;
    const filesPresent = !!this.selectedScreenshot || !!this.selectedFile;

    if (!descriptionPresent && !filesPresent) {
      return { valid: false, message: 'Please provide a description or attach at least one file.' };
    }

    // optional: enforce description required
    if (!descriptionPresent) {
      return { valid: false, message: 'Please add a work description.' };
    }

    // optional: check file sizes (example: max 10MB)
    const maxBytes = 10 * 1024 * 1024;
    if (this.selectedScreenshot && this.selectedScreenshot.size > maxBytes) {
      return { valid: false, message: 'Screenshot exceeds maximum size of 10MB.' };
    }
    if (this.selectedFile && this.selectedFile.size > maxBytes) {
      return { valid: false, message: 'Supporting document exceeds maximum size of 10MB.' };
    }

    return { valid: true };
  }



submitTaskWithEvidence(): void {

  const validation = this.validateEvidence();

  if (!validation.valid) {

    Swal.fire({
      icon: 'warning',
      title: 'Validation',
      text: validation.message
    });

    return;

  }

  Swal.fire({
    title: 'Submit Task?',
    text: 'Evidence will be uploaded and task will be submitted for review.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Submit',
    cancelButtonText: 'Cancel'
  }).then((result) => {

    if (!result.isConfirmed) {
      return;
    }

    const formData = new FormData();

    formData.append(
      'description',
      this.evidenceDescription
    );

    if (this.selectedScreenshot) {
      formData.append(
        'screenshot',
        this.selectedScreenshot
      );
    }

    if (this.selectedFile) {
      formData.append(
        'file',
        this.selectedFile
      );
    }

    // Step 1: Upload Evidence

    this.taskService
      .uploadEvidence(
        this.taskId,
        formData
      )
      .subscribe({

        next: () => {

          // Step 2: Submit Task

          this.taskService
            .submitTask(this.taskId)
            .subscribe({

              next: () => {

                Swal.fire({
                  icon: 'success',
                  title: 'Success',
                  text: 'Task submitted for review successfully'
                });

                this.loadTask(this.taskId);

                this.evidenceDescription = '';
                this.selectedScreenshot = null;
                this.selectedFile = null;

              },

              error: (err) => {

                Swal.fire({
                  icon: 'error',
                  title: 'Submit Failed',
                  text:
                    err?.error?.detail ||
                    'Task submission failed'
                });

              }

            });

        },

        error: (err) => {

          Swal.fire({
            icon: 'error',
            title: 'Upload Failed',
            text:
              err?.error?.detail ||
              'Evidence upload failed'
          });

        }

      });

  });

}


loadTaskReviews():void{
  const user  = JSON.parse(sessionStorage.getItem('user') || '{}')

  this.taskService.getEmployeeTaskReviews(user.id).subscribe({
    next:(data)=>{
      this.taskReviews =data
      console.log("reviews",this.taskReviews)
      this.cdr.detectChanges()

    }
  })
}

}
