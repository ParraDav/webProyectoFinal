import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CursoService } from '../../services/curso-service';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './cursos.html',
  styleUrl: './cursos.css'
})

export class Cursos {

  cursos: any[] = [];

  constructor(
    private cursoService: CursoService
  ) { }

  ngOnInit() {

    this.obtenerCursos();

  }

  obtenerCursos() {

    this.cursoService
      .getCursos()
      .subscribe({

        next: (res: any) => {

          console.log(res);

          this.cursos = res;

        },

        error: (err) => {

          console.log(err);

        }

      });

  }

}