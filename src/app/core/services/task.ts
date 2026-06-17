import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Task {

  private url = 'http://localhost:8000/tasks';
  constructor(private http:HttpClient){

  }

  // get group task
 get_group_task(groupId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.url}/group/${groupId}`);
}
}
