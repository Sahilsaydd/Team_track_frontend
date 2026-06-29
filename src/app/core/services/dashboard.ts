import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardResponse } from '../model/dashboard';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  private url = 'http://localhost:8000/dashboard';

  constructor(private http: HttpClient) {

  }


  getDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(`${this.url}/superadmin`)
  }
}
