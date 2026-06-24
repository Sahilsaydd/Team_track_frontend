import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Notification } from '../../../core/services/notification';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification-details',
  imports: [CommonModule],
  templateUrl: './notification-details.html',
  styleUrl: './notification-details.css',
})
export class NotificationDetails implements OnInit{

  notifications:any[]=[]
  constructor(private notificationService:Notification ,private cdr:ChangeDetectorRef){

  }

  ngOnInit(): void {

    this.loadNotifications()
    this.cdr.detectChanges()
  }

  loadNotifications():void{
    this.notificationService.getNotificationsOfUser().subscribe({
      next:(data:any)=>{
        this.notifications =data
        this.markAllAsRead()
        console.log("Notifications ",this.notifications)
        this.cdr.detectChanges()


      }
    })
  }

  markAllAsRead():void{
    this.notificationService.markAllRead().subscribe({
      next:(data:any)=>{
        this.notifications =data
        console.log("All notifications marked as read")
        this.cdr.detectChanges()

      }
    })
  }

}
