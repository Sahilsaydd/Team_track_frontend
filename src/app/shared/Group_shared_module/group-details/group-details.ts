import { Component, OnInit , ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Group } from '../../../core/services/group';
import { routes } from '../../../app.routes';

@Component({
  selector: 'app-group-details',
  imports: [],
  templateUrl: './group-details.html',
  styleUrl: './group-details.css',
})
export class GroupDetails implements OnInit{

  group_id!:number
  constructor(private group_service:Group , private cdr:ChangeDetectorRef, private route: ActivatedRoute){}

  ngOnInit(){
    // fetch group details by id
    this.group_id = Number(this.route.snapshot.paramMap.get('id'));
    this.group_service.get_group_by_id(this.group_id).subscribe({
      next:(data)=>{
        console.log(data)
      }
    })

    this.group_service.get_group_members(this.group_id).subscribe({
      next:(data)=>{
        console.log(data)
      }
    })

  }
}
