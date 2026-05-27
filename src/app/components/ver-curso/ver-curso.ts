import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CursoService } from '../../services/curso-service';
import { AuthService } from '../../services/auth-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ver-curso',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './ver-curso.html',
  styleUrl: './ver-curso.css'
})
export class VerCurso implements OnInit {

  curso: any = null;
  cargando = true;
  inscribiendo = false;
  inscrito = false;

  // Progreso
  modulosCompletados: string[] = [];
  completandoModulo: Record<string, boolean> = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cursoService: CursoService,
    public auth: AuthService,
    private toastr: ToastrService
  ) {}

  get isLoggedIn()   { return this.auth.isLoggedIn(); }
  get rol()          { return this.auth.getRol(); }
  get isEstudiante() { return this.rol === 'estudiante'; }
  get canManage()    { return this.rol === 'instructor' || this.rol === 'administrador'; }

  get progreso(): number {
    if (!this.curso?.modulos?.length) return 0;
    return Math.round((this.modulosCompletados.length / this.curso.modulos.length) * 100);
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    // Si está autenticado, carga vista completa; si no, vista pública
    const req = this.isLoggedIn
      ? this.cursoService.getCursos()
      : this.cursoService.getCursoPublico(id);

    if (this.isLoggedIn) {
      // Necesitamos el curso específico autenticado — usamos la ruta pública + token en interceptor
      this.cursoService.getCursoPublico(id).subscribe({
        next: (data) => { this.curso = data; this.cargando = false; },
        error: () => { this.cargando = false; }
      });
    } else {
      this.cursoService.getCursoPublico(id).subscribe({
        next: (data) => { this.curso = data; this.cargando = false; },
        error: () => { this.cargando = false; }
      });
    }
  }

  inscribirse() {
    if (!this.isLoggedIn) {
      this.toastr.info('Inicia sesión para inscribirte', 'Sesión requerida');
      this.router.navigate(['/login']);
      return;
    }
    this.inscribiendo = true;
    this.cursoService.inscribirse(this.curso._id).subscribe({
      next: () => {
        this.inscrito = true;
        this.inscribiendo = false;
        this.toastr.success('¡Te inscribiste correctamente!', 'Inscripción exitosa');
      },
      error: (err) => {
        this.inscribiendo = false;
        const msg = err?.error?.mensaje ?? 'Error al inscribirse';
        if (msg.includes('Ya estás inscrito')) {
          this.inscrito = true;
          this.toastr.info('Ya estás inscrito en este curso', 'Info');
        } else {
          this.toastr.error(msg, 'Error');
        }
      }
    });
  }

  completarModulo(idModulo: string) {
    this.completandoModulo[idModulo] = true;
    this.cursoService.completarModulo(this.curso._id, idModulo).subscribe({
      next: (res: any) => {
        this.modulosCompletados = res.modulosCompletados ?? [];
        this.completandoModulo[idModulo] = false;
        this.toastr.success('¡Módulo completado!', '🏆');
      },
      error: (err) => {
        this.completandoModulo[idModulo] = false;
        const msg = err?.error?.mensaje ?? 'Error al completar módulo';
        this.toastr.error(msg, 'Error');
      }
    });
  }

  isCompletado(idModulo: string): boolean {
    return this.modulosCompletados.includes(idModulo);
  }
}