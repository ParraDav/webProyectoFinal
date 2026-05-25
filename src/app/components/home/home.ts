import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CursoService } from '../../services/curso-service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  cursos: any[] = [];
  cargando = true;

  constructor(private cursoService: CursoService) { }

  ngOnInit() {
    this.cursoService.getCursosPublicos().subscribe({
      next: (data) => {
        this.cursos = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }
}