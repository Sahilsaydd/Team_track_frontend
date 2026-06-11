import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import { Group } from '../../../core/services/group';

@Component({
  selector: 'app-get-all-groups',
  imports: [],
  templateUrl: './get-all-groups.html',
  styleUrl: './get-all-groups.css',
})
export class GetAllGroups implements OnInit{

  group_details:Group[] = []

  constructor(private groupService:Group,private cdr:ChangeDetectorRef){

  }

  ngOnInit(){
    this.all_groups();
    this.cdr.detectChanges()
  }

  all_groups(){
    this.groupService.getAllGroups().subscribe({
      next:(data)=>{
        this.group_details = data

        console.log(this.group_details)
        this.cdr.detectChanges();
      }
    })
  }
}
