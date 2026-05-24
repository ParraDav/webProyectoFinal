import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [Navbar],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register { }
