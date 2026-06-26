import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User_model } from '../model/user';

export interface AppUser {
  id: number;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class User {
  private url = 'http://localhost:8000/users';
  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(`${this.url}/`);
  }

  createAdmin(data: any): Observable<User_model> {
    return this.http.post<User_model>(`${this.url}/create_admin`, data);
  }

  createEmployee(data:any): Observable<User_model> {
    return this.http.post<User_model>(`${this.url}/create_employee`, data);
  }

  getAllEmployees(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(`${this.url}/all_employees`);
  }

  getAllAdmins(){
    return this.http.get<any[]>(`${this.url}/all_admins`)
  }
  deactivateEmployee(id: number): Observable<any> {
    return this.http.put<any>(`${this.url}/deactivate/${id}`, {});
  }

  activateEmployee(id: number): Observable<any>{
    return this.http.put<any>(`${this.url}/activate/${id}`, {});
  }


}
