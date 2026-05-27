import { Component, OnInit, HostListener } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {

  isLoggedIn = false;
  rol: string | null = null;
  menuOpen = false;
  scrolled = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.syncAuth();
  }

  /** Re-sync auth state (called on every navigation) */
  syncAuth() {
    this.isLoggedIn = this.auth.isLoggedIn();
    this.rol = this.auth.getRol();
  }

  get isAdmin()      { return this.rol === 'administrador'; }
  get isInstructor() { return this.rol === 'instructor'; }
  get isEstudiante() { return this.rol === 'estudiante'; }

  logout() {
    this.auth.logout();
    this.isLoggedIn = false;
    this.rol = null;
    this.menuOpen = false;
    this.router.navigate(['/']);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 20;
  }
}