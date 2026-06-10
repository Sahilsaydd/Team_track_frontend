import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateGroupModel } from '../model/create-group-model';

@Injectable({
  providedIn: 'root',
})
export class Group {
  private url = 'http://localhost:8000/groups';
  constructor(private http:HttpClient){}
  

  // create the new group
  createGroup(data:CreateGroupModel){
    return this.http.post(`${this.url}/create_group`,data)
  }

}
