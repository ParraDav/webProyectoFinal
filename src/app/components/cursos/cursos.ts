import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Navbar } from '../navbar/navbar';
@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar],
  templateUrl: './cursos.html',
  styleUrl: './cursos.css'
})
export class Cursos {

}