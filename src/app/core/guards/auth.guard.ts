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


    if (user) {

      return true;

    }


    return this.router.createUrlTree(['/login']);

  }

}
