import { Injectable } from '@angular/core';

import {
  CanActivate,
  Router,
  UrlTree
} from '@angular/router';

import {
  Observable
} from 'rxjs';



@Injectable({

  providedIn: 'root'

})

export class AuthGuard implements CanActivate {

  constructor(

    private router: Router

  ) {}



  canActivate():

    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {


    const user = sessionStorage.getItem('user');
    const currentUser = sessionStorage.getItem('currentUser');
    const token = sessionStorage.getItem('token');

    // Some parts of the app store the logged in user under `currentUser`.
    // Accept either `user` or `currentUser` (or a token) as valid authentication.
    if (user || currentUser || token) {
      return true;
    }

    return this.router.createUrlTree(['/login']);

  }

}
