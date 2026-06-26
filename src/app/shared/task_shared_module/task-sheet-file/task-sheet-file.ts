import { ChangeDetectorRef, Component } from '@angular/core';
import { Task } from '../../../core/services/task';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-sheet-file',
  imports: [CommonModule,FormsModule],
  templateUrl: './task-sheet-file.html',
  styleUrl: './task-sheet-file.css',
})
export class TaskSheetFile {
  reportType = 'daily';

selectedDate = '';
constructor( private taskService:Task , private cdr:ChangeDetectorRef){}




downloadReport(): void {

  this.taskService
    .exportReport(
      this.reportType,
      this.selectedDate
    )
    .subscribe({

      next: (response: Blob) => {

        const blob = new Blob(
          [response],
          {
            type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          }
        );
        this.cdr.detectChanges()

        const downloadURL =
          window.URL.createObjectURL(blob);

        const link =
          document.createElement('a');

        link.href = downloadURL;

        link.download =
          `${this.reportType}_report.xlsx`;

        link.click();

        window.URL.revokeObjectURL(
          downloadURL
        );

        Swal.fire({
          icon: 'success',
          title: 'Downloaded',
          text: 'Report downloaded successfully'
        });

      },

      error: (err) => {

        console.error(err);

        Swal.fire({
          icon: 'error',
          title: 'Download Failed',
          text:
            err?.error?.detail ||
            'Unable to download report'
        });

      }

    });
}
}
