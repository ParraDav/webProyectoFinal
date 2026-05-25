import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CursoService } from '../../services/curso-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-ver-curso',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ver-curso.html',
  styleUrl: './ver-curso.css'
})
export class VerCurso implements OnInit {

  curso: any = null;
  cargando = true;
  inscribiendo = false;
  mensajeExito = '';
  mensajeError = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cursoService: CursoService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cursoService.getCursoPublico(id).subscribe({
        next: (data) => {
          this.curso = data;
          this.cargando = false;
        },
        error: () => {
          this.cargando = false;
        }
      });
    }
  }

  inscribirse() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.inscribiendo = true;
    this.mensajeExito = '';
    this.mensajeError = '';

    this.cursoService.inscribirse(this.curso._id).subscribe({
      next: () => {
        this.mensajeExito = '¡Te has inscrito correctamente!';
        this.inscribiendo = false;
      },
      error: (err) => {
        this.mensajeError = err.error?.mensaje || 'Error al inscribirse';
        this.inscribiendo = false;
      }
    });
  }
}