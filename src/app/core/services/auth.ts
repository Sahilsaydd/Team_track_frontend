import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  url = 'http://localhost:8000/auth/';

  constructor(private http: HttpClient) { }

  login(data: any) {

    return this.http.post(this.url + 'login', data, { withCredentials: true });
  }

  logout() {
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(
      this.url + 'logout', {}, { headers, withCredentials: true }
    );

  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('token');
  }
}

