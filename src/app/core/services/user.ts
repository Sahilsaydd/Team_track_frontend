import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

  // Get all users
  getAllUsers(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(`${this.url}/`);
  }

  // Create the new Admin
  createAdmin(data: any): Observable<AppUser> {
    return this.http.post<AppUser>(`${this.url}/create_admin`, data);
  }

}
