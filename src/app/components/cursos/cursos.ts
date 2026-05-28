import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CursoService } from '../../services/curso-service';
import { AuthService } from '../../services/auth-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cursos.html',
  styleUrl: './cursos.css'
})
export class Cursos implements OnInit, OnDestroy {

  cursos: any[] = [];
  cargando = true;
  searchTerm = '';
  inscribiendo: Record<string, boolean> = {};

  private search$ = new Subject<string>();

  constructor(
    private cursoService: CursoService,
    private auth: AuthService,
    private toastr: ToastrService
  ) {}

  get isLoggedIn()   { return this.auth.isLoggedIn(); }
  get rol()          { return this.auth.getRol(); }
  get isEstudiante() { return this.rol === 'estudiante'; }
  get isInstructor() { return this.rol === 'instructor'; }
  get isAdmin()      { return this.rol === 'administrador'; }
  get canManage()    { return this.isInstructor || this.isAdmin; }

  esDuenio(curso: any): boolean {
    if (this.isAdmin) return true;
    if (this.isInstructor) {
      const userId = this.auth.getUserId();
      const instructorId = curso.instructor?._id || curso.instructor;
      return userId === instructorId;
    }
    return false;
  }

  private iconMap: Record<string, string> = {
    react: '⚛️', angular: '🅰️', node: '🟢', python: '🐍',
    javascript: '🟨', css: '🎨', html: '🌐', java: '☕',
    typescript: '💙', sql: '🗄️', docker: '🐳', git: '🔀',
    diseño: '✏️', marketing: '📣', datos: '📊', machine: '🤖',
    inteligencia: '🧠', seguridad: '🔒', cloud: '☁️'
  };

  ngOnInit() {
    this.obtenerCursos();

    // Debounce de búsqueda — 400ms
    this.search$.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(term => this.obtenerCursos(term));
  }

  ngOnDestroy() { this.search$.complete(); }

  obtenerCursos(search?: string) {
    this.cargando = true;

    const req = this.isLoggedIn
      ? this.cursoService.getCursos(search)
      : this.cursoService.getCursosPublicos();

    req.subscribe({
      next: (res: any) => { this.cursos = res; this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }

  onSearch() { this.search$.next(this.searchTerm); }

  clearSearch() { this.searchTerm = ''; this.obtenerCursos(); }

  inscribirse(curso: any) {
    if (!this.isLoggedIn) {
      this.toastr.info('Debes iniciar sesión para inscribirte', 'Iniciar sesión');
      return;
    }
    this.inscribiendo[curso._id] = true;
    this.cursoService.inscribirse(curso._id).subscribe({
      next: () => {
        this.toastr.success(`¡Te inscribiste en "${curso.nombre}"!`, 'Inscripción exitosa');
        this.inscribiendo[curso._id] = false;
      },
      error: (err) => {
        const msg = err?.error?.mensaje ?? 'Error al inscribirse';
        this.toastr.error(msg, 'Error');
        this.inscribiendo[curso._id] = false;
      }
    });
  }

  getCourseIcon(nombre: string): string {
    const n = (nombre || '').toLowerCase();
    for (const [key, icon] of Object.entries(this.iconMap)) {
      if (n.includes(key)) return icon;
    }
    return '📖';
  }
}