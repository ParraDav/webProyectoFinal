import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  @ViewChild(Navbar) navbar!: Navbar;

  constructor(private router: Router) {}

  ngOnInit() {
    // Sincroniza el estado del Navbar tras cada navegación exitosa
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      this.navbar?.syncAuth();
    });
  }
}
