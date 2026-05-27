import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CursoService } from '../../services/curso-service';
import { AuthService } from '../../services/auth-service';
import { UsuarioService } from '../../services/usuario-service';
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

  // Progreso del estudiante
  modulosCompletados: string[] = [];
  completandoModulo: Record<string, boolean> = {};

  // ── Instructor/Admin — Editar Curso ──────────────────
  editandoCurso = false;
  cursoEdit = { nombre: '', descripcion: '', estado: '' };
  guardandoCurso = false;

  // ── Instructor/Admin — Módulos ───────────────────────
  mostrarFormModulo = false;
  nuevoModulo = { titulo: '', contenido: '' };
  creandoModulo = false;

  moduloEditId: string | null = null;
  moduloEditData = { titulo: '', contenido: '' };
  guardandoModulo = false;
  eliminandoModulo: Record<string, boolean> = {};

  // ── Inscritos ────────────────────────────────────────
  mostrarInscritos = false;
  inscritos: any[] = [];
  cargandoInscritos = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cursoService: CursoService,
    private usuarioService: UsuarioService,
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
    if (!id) {
      this.cargando = false;
      return;
    }
    this.cargarCurso(id);
  }

  cargarCurso(id: string) {
    this.cargando = true;
    this.cursoService.getCursoPublico(id).subscribe({
      next: (data) => {
        this.curso = data;
        
        // Si el usuario es un estudiante logueado, verificar si está inscrito
        if (this.isLoggedIn && this.isEstudiante) {
          this.usuarioService.misCursos().subscribe({
            next: (cursosInscritos: any[]) => {
              const cursoInscrito = cursosInscritos.find(c => c._id === this.curso._id);
              if (cursoInscrito) {
                this.inscrito = true;
                this.modulosCompletados = cursoInscrito.modulosCompletados || [];
              } else {
                this.inscrito = false;
                this.modulosCompletados = [];
              }
              this.cargando = false;
            },
            error: () => {
              this.inscrito = false;
              this.cargando = false;
            }
          });
        } else {
          this.cargando = false;
        }
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  // ── Inscripción (Estudiante) ──────────────────────────
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

  // ── Completar Módulo (Estudiante) ────────────────────
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
        this.toastr.error(err?.error?.mensaje ?? 'Error al completar módulo', 'Error');
      }
    });
  }

  isCompletado(idModulo: string): boolean {
    return this.modulosCompletados.includes(idModulo);
  }

  // ── Editar Curso (Instructor/Admin) ──────────────────
  abrirEditarCurso() {
    this.cursoEdit = {
      nombre: this.curso.nombre,
      descripcion: this.curso.descripcion,
      estado: this.curso.estado
    };
    this.editandoCurso = true;
  }

  guardarCurso() {
    this.guardandoCurso = true;
    this.cursoService.actualizarCurso(this.curso._id, this.cursoEdit).subscribe({
      next: (updated: any) => {
        this.curso = { ...this.curso, ...updated };
        this.editandoCurso = false;
        this.guardandoCurso = false;
        this.toastr.success('Curso actualizado correctamente', '✅');
      },
      error: (err) => {
        this.guardandoCurso = false;
        this.toastr.error(err?.error?.mensaje ?? 'Error al actualizar', 'Error');
      }
    });
  }

  eliminarCurso() {
    if (!confirm(`¿Eliminar el curso "${this.curso.nombre}"? Esta acción no se puede deshacer.`)) return;
    this.cursoService.eliminarCurso(this.curso._id).subscribe({
      next: () => {
        this.toastr.success('Curso eliminado', '🗑️');
        this.router.navigate(['/cursos']);
      },
      error: (err) => this.toastr.error(err?.error?.mensaje ?? 'Error al eliminar', 'Error')
    });
  }

  // ── Módulos (Instructor/Admin) ───────────────────────
  abrirAgregarModulo() {
    this.nuevoModulo = { titulo: '', contenido: '' };
    this.mostrarFormModulo = true;
  }

  agregarModulo() {
    if (!this.nuevoModulo.titulo.trim()) {
      this.toastr.warning('El título es obligatorio', 'Aviso');
      return;
    }
    this.creandoModulo = true;
    this.cursoService.agregarModulo(this.curso._id, this.nuevoModulo).subscribe({
      next: (res: any) => {
        this.curso.modulos.push(res.modulo);
        this.nuevoModulo = { titulo: '', contenido: '' };
        this.mostrarFormModulo = false;
        this.creandoModulo = false;
        this.toastr.success('Módulo agregado', '✅');
      },
      error: (err) => {
        this.creandoModulo = false;
        this.toastr.error(err?.error?.mensaje ?? 'Error al agregar módulo', 'Error');
      }
    });
  }

  abrirEditarModulo(modulo: any) {
    this.moduloEditId = modulo._id;
    this.moduloEditData = { titulo: modulo.titulo, contenido: modulo.contenido };
  }

  guardarModulo() {
    if (!this.moduloEditId) return;
    this.guardandoModulo = true;
    this.cursoService.actualizarModulo(this.curso._id, this.moduloEditId, this.moduloEditData).subscribe({
      next: (res: any) => {
        const idx = this.curso.modulos.findIndex((m: any) => m._id === this.moduloEditId);
        if (idx !== -1) this.curso.modulos[idx] = res.modulo;
        this.moduloEditId = null;
        this.guardandoModulo = false;
        this.toastr.success('Módulo actualizado', '✅');
      },
      error: (err) => {
        this.guardandoModulo = false;
        this.toastr.error(err?.error?.mensaje ?? 'Error al actualizar módulo', 'Error');
      }
    });
  }

  eliminarModulo(idModulo: string) {
    if (!confirm('¿Eliminar este módulo?')) return;
    this.eliminandoModulo[idModulo] = true;
    this.cursoService.eliminarModulo(this.curso._id, idModulo).subscribe({
      next: () => {
        this.curso.modulos = this.curso.modulos.filter((m: any) => m._id !== idModulo);
        this.eliminandoModulo[idModulo] = false;
        this.toastr.success('Módulo eliminado', '🗑️');
      },
      error: (err) => {
        this.eliminandoModulo[idModulo] = false;
        this.toastr.error(err?.error?.mensaje ?? 'Error al eliminar módulo', 'Error');
      }
    });
  }

  // ── Ver Inscritos (Instructor/Admin) ─────────────────
  verInscritos() {
    this.mostrarInscritos = true;
    this.cargandoInscritos = true;
    this.cursoService.verInscritos(this.curso._id).subscribe({
      next: (data: any[]) => {
        this.inscritos = data;
        this.cargandoInscritos = false;
      },
      error: (err) => {
        this.cargandoInscritos = false;
        this.toastr.error(err?.error?.mensaje ?? 'Error al cargar inscritos', 'Error');
        this.mostrarInscritos = false;
      }
    });
  }
}
