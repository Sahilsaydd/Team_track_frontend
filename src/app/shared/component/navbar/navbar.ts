import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { Notification } from '../../../core/services/notification';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink,CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit{
  user: any = null;
  unreadCount: number = 0;
  constructor(private auth:Auth,private notificationService:Notification,private router:Router,private cdr:ChangeDetectorRef){
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      try {
        this.user = JSON.parse(userStr);
      } catch (e) {
        console.error('Error parsing user data', e);
      }
    }
  }


  ngOnInit(): void {
 this.loadUnreadCount()
 this.cdr.detectChanges()
  }
  loadUnreadCount():void{
    this.notificationService.getUnreadCount().subscribe({
      next:(response:any)=>{
        this.unreadCount = response.unread_count;
        this.cdr.detectChanges()
      },
      error:(err)=>{
        console.error("Failed to load the notification count ",err)
      }
    })
  }
  isProfileMenuOpen = false;

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  closeProfileMenu(): void {
    this.isProfileMenuOpen = false;
  }


  logout(): void {
    this.closeProfileMenu();
    this.auth.logout().subscribe({
      next:()=>{
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        this.router.navigateByUrl('/login');

      },
      error:(error)=>{
        console.error('Logout failed', error);
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        this.router.navigateByUrl('/login');
      }
    })
  }

  goToNotifiaction():void{
     this.unreadCount = 0;
    this.router.navigate(['notification/employeeNotifications']);
  }
}
