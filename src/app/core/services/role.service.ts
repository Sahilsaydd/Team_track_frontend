import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private roleSubject = new BehaviorSubject<string>(sessionStorage.getItem('role') || '');
  role$ = this.roleSubject.asObservable();

  setRole(role: string) {
    sessionStorage.setItem('role', role);
    this.roleSubject.next(role);
  }

  getRole(): string {
    return this.roleSubject.value;
  }

  isAdmin(): boolean {
    const r = this.getRole();
    return r === 'Admin' || r === 'SuperAdmin';
  }
}
