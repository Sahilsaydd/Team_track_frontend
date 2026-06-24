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

get_task_details(taskId: number): Observable<any>{
  return this.http.get<any>(`${this.url}/${taskId}`);
}

createTask(data: any) {
  return this.http.post(
    `${this.url}/assign`,
    data
  );
}
updateTaskStatus(taskId:number ,status:string): Observable<any>{
  return this.http.patch(`${this.url}/${taskId}/status`,{status:status})
}

uploadEvidence(
  taskId: number,
  formData: FormData
) {
  return this.http.post(
    `${this.url}/${taskId}/evidence`,
    formData
  );
}

submitTask(taskId: number) {
  return this.http.post(
    `${this.url}/${taskId}/submit`,
    {}
  );
}

getTaskEvidence(taskId: number){
  return this.http.get<any[]>(`${this.url}/${taskId}/evidence`)
}

reviewTask(taskId: number,payload: {review_status: string;comment: string;}) {

  return this.http.post(`${this.url}/${taskId}/review`,payload);

}

getEmployeeTaskReviews(userId: number) {
  return this.http.get<any[]>(
    `${this.url}/employee/${userId}`
  );
}

getEmployeeTaskReviewsById(taskId:number){
  return this.http.get(`${this.url}/${taskId}/reviews`)
}

createSelfTask(data:any){
  return this.http.post(`${this.url}/self`,data)
}
}
