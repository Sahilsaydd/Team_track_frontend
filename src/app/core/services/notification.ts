import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Notification {
  private url = 'http://localhost:8000/notifications'
  constructor(private http:HttpClient){

  }

 getNotificationsOfUser(){
    return this.http.get(`${this.url}/`)
 }


markAllRead() {
  return this.http.patch<any>(
    `${this.url}/read-all`,
    {}
  );
}

 getUnreadCount(){
  return this.http.get(`${this.url}/unread/count`)
 }
}
