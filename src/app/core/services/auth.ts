import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  url =  'http://127.0.0.1:8000/auth/login';

  constructor(private http: HttpClient) {}

  login(data: any){
    return this.http.post(this.url,data ,{withCredentials: true});

  }
  
}
