import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
    return this.http.post(
      this.url + 'logout', {}, { withCredentials: true }
    );

  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('user') || !!sessionStorage.getItem('role');
  }
}
