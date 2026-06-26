import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../core/services/task';

@Component({
  selector: 'app-personal-assigned-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './personal-assigned-task.html',
  styleUrl: './personal-assigned-task.css'
})
export class PersonalAssignedTaskComponent  {

}
