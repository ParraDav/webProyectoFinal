import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [Navbar],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {}
