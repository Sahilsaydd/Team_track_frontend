
import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';


import Swal from 'sweetalert2';
import { Task } from '../../../../core/services/task';
import { Group } from '../../../../core/services/group';
import { filter } from 'rxjs/operators';
import { ThisReceiver } from '@angular/compiler';
@Component({
  selector: 'app-create-group-task',
  imports: [ CommonModule,FormsModule,RouterModule],
  templateUrl: './create-group-task.html',
  styleUrl: './create-group-task.css',
})
export class CreateGroupTask implements OnInit {
  groupId!: number;
  members: any[] = [];
  minDeadline = '';
  taskData = {
    title: '',
    description: '',
    priority: '',
    deadline: '',
    assigned_to: null
  }

  constructor(private route: ActivatedRoute, private router:Router,private taskService:Task , private groupService:Group , private cdr:ChangeDetectorRef){}

  ngOnInit(): void {
    this.groupId = Number(this.route.snapshot.paramMap.get('groupId'))
    this.minDeadline = this.getTodayDate();
    this.loadMembers();
    this.cdr.detectChanges()
  }

  private getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


loadMembers(): void {

  this.groupService.get_group_members(this.groupId).subscribe({

    next: (res: any) => {

      console.log('group member response', res);

      this.members = (res.members || []).filter(
        (m: any) => m.role_in_group !== 'Lead'
      );
      this.cdr.detectChanges()

      console.log('Members for dropdown:', this.members);

    },

    error: (err) => {
      console.error(err);
    }

  });

}

  createTask(): void {
    if (this.taskData.deadline && this.taskData.deadline < this.minDeadline) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid deadline',
        text: 'Deadline cannot be in the past. Please choose today or a future date.'
      });
      return;
    }

    if (
      !this.taskData.title ||
      !this.taskData.description ||
      !this.taskData.priority ||
      !this.taskData.deadline ||
      !this.taskData.assigned_to
    ) {

      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill all fields'
      });

      return;
    }

    const payload = {

      title: this.taskData.title,

      description: this.taskData.description,

      priority: this.taskData.priority,

      deadline: this.taskData.deadline,

      assigned_to: this.taskData.assigned_to,

      group_id: this.groupId

    };

    this.taskService
      .createTask(payload)
      .subscribe({

        next: () => {

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Task assigned successfully'
          });

          this.router.navigate([
            '/groups',
            this.groupId
          ]);

        },

        error: (err) => {

          console.error(err);

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text:
              err?.error?.detail ||
              'Unable to create task'
          });

        }

      });
    }
}
