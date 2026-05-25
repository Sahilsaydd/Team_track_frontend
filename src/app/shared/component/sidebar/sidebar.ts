import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";

declare const bootstrap: any;

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements AfterViewInit {
  @ViewChild('sidebarOffcanvas', { static: true }) sidebarEl!: ElementRef;
  private offcanvasInstance: any;

  ngAfterViewInit(): void {
    if (typeof bootstrap !== 'undefined' && this.sidebarEl) {
      this.offcanvasInstance = new bootstrap.Offcanvas(this.sidebarEl.nativeElement);
    }
  }

  open() {
    this.offcanvasInstance?.show();
  }

  close() {
    this.offcanvasInstance?.hide();
  }

  toggle() {
    if (this.offcanvasInstance) {
      const isShown = this.sidebarEl.nativeElement.classList.contains('show');
      isShown ? this.close() : this.open();
    }
  }

}
