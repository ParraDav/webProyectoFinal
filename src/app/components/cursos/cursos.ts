import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [Navbar],
  templateUrl: './cursos.html',
  styleUrl: './cursos.css',
})
export class Cursos { }
