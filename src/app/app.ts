import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Navbar } from './shared/component/navbar/navbar';
import { Sidebar } from './shared/component/sidebar/sidebar';
import { Footer } from './shared/component/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet ,Navbar,Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  showShell = signal(true);

  ngOnInit(): void {
    const updateShell = () => {
      this.showShell.set(!this.router.url.startsWith('/login'));
    };

    updateShell();

    const sub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        updateShell();
      }
    });

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

}
