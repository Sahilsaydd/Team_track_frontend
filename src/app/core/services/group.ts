import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateGroupModel } from '../model/create-group-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Group {
  private url = 'http://localhost:8000/groups';
  constructor(private http:HttpClient){}


  // create the new group
  createGroup(data:CreateGroupModel){
    return this.http.post(`${this.url}/create`,data)
  }


  // Get all the active groups
  getAllGroups(): Observable<any[]>{
    return this.http.get<any[]>(`${this.url}/`)
  }

  // get the group by its id

  get_group_by_id(id:number):Observable<any>{
    return this.http.get<any>(`${this.url}/${id}`)
  }

  // get the group member
  get_group_members(group_id:number):Observable<any>{
    return this.http.get<any>(`${this.url}/${group_id}/members`)
  }

}
