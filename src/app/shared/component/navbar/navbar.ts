import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  user: any = null;

  constructor(private auth:Auth,private router:Router){
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      try {
        this.user = JSON.parse(userStr);
      } catch (e) {
        console.error('Error parsing user data', e);
      }
    }
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

}
