import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreatePersonalTask } from '../model/create-personal-task';

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

getSelfAllTask():Observable<any>{
  return this.http.get(`${this.url}/self_tasks`)
}


addTaskLog(data:any){
  return this.http.post(`${this.url}/logs`,data)
}

exportReport(
  reportType: string,
  selectedDate?: string
): Observable<Blob> {

  let url = `${this.url}/report/export?report_type=${reportType}`;

  if (selectedDate) {
    url += `&selected_date=${selectedDate}`;
  }

  return this.http.get(url, {
    responseType: 'blob'
  });
}

createPersonalTask(data:CreatePersonalTask){
  return this.http.post(`${this.url}/personal`,data)
}

getPersonalAssignedTasks(): Observable<any>{
  return this.http.get(`${this.url}/personal/assigned`)

}

getPersonalTasksForReview(): Observable<any[]>{
  return this.http.get<any[]>(`${this.url}/personal-tasks/review`)
}

}
