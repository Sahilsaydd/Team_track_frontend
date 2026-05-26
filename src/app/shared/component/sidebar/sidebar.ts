import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { RoleService } from '../../../core/services/role.service';
import { SIDEBAR_NAV, NavItem } from '../../../core/config/sidebar-nav.config';

declare const bootstrap: any;

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('sidebarOffcanvas', { static: true }) sidebarEl!: ElementRef;
  private offcanvasInstance: any;
  private routerSubscription?: Subscription;
  private roleSubscription?: Subscription;


  menuItems: NavItem[] = [];

  
  expandedMenus: Record<string, boolean> = {};

  constructor(
    private router: Router,
    public roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.roleSubscription = this.roleService.role$.subscribe(role => {
      this.menuItems = SIDEBAR_NAV[role] || [];
      this.expandedMenus = {};
      this.autoExpandActiveParent();
    });

    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.close();
      this.autoExpandActiveParent();
    });
  }

  ngAfterViewInit(): void {
    if (typeof bootstrap !== 'undefined' && this.sidebarEl) {
      this.offcanvasInstance = new bootstrap.Offcanvas(this.sidebarEl.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
    this.roleSubscription?.unsubscribe();
  }


  open(): void {
    this.offcanvasInstance?.show();
  }

  close(): void {
    this.offcanvasInstance?.hide();
  }

  toggle(): void {
    if (this.offcanvasInstance) {
      const isShown = this.sidebarEl.nativeElement.classList.contains('show');
      isShown ? this.close() : this.open();
    }
  }


  toggleMenu(label: string): void {
    this.expandedMenus[label] = !this.expandedMenus[label];
  }

  isExpanded(label: string): boolean {
    return !!this.expandedMenus[label];
  }



  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }


  isParentActive(item: NavItem): boolean {
    if (!item.children) return false;
    return item.children.some(child => this.router.url === child.route);
  }

  private autoExpandActiveParent(): void {
    for (const item of this.menuItems) {
      if (item.children?.some(child => this.router.url === child.route)) {
        this.expandedMenus[item.label] = true;
      }
    }
  }
}
