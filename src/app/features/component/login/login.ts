import { Component, OnInit } from '@angular/core';

import { FormsModule,NgForm} from '@angular/forms';

import { Router } from '@angular/router';

import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-login',

  imports: [FormsModule],

  templateUrl: './login.html',

  styleUrl: './login.css',
})

export class Login implements OnInit {

  email:string = '';

  password:string = '';

  loading:boolean = false;

  errorMessage:string = '';

  constructor(private auth:Auth,private router:Router){}

  ngOnInit(): void {

  }

  login(form:NgForm):void{
    if(form.invalid){
      form.control.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    const data = {
      email:this.email,
      password:this.password
    };

    this.auth.login(data).subscribe({
      next:(response:any)=>{
        const role = response?.role || response?.user?.role;
        localStorage.setItem('role', role ?? '');
        localStorage.setItem('user', JSON.stringify(response?.user ?? null));

        this.loading = false;

        this.router.navigate(['/']);
      },
      error:(error)=>{
        this.loading = false;
        this.errorMessage = error?.error?.detail || 'Login Failed';
      }
    });
  }

}
