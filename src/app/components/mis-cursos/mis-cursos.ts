import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/usuario-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-mis-cursos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mis-cursos.html',
  styleUrl: './mis-cursos.css',
})
export class MisCursos implements OnInit {

  cursos: any[] = [];
  cargando = true;
  perfil: any = null;

  private iconMap: Record<string, string> = {
    react: '⚛️', angular: '🅰️', node: '🟢', python: '🐍',
    javascript: '🟨', css: '🎨', html: '🌐', java: '☕',
    typescript: '💙', sql: '🗄️', docker: '🐳', git: '🔀',
    diseño: '✏️', marketing: '📣', datos: '📊', machine: '🤖',
    inteligencia: '🧠', seguridad: '🔒', cloud: '☁️'
  };

  constructor(
    private usuarioService: UsuarioService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    // Cargar perfil y cursos en paralelo
    this.usuarioService.obtenerPerfil().subscribe({
      next: (data) => { this.perfil = data; },
      error: () => {}
    });

    this.usuarioService.misCursos().subscribe({
      next: (data: any[]) => {
        this.cursos = data.filter(Boolean); // filtra nulls por cursos eliminados
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  getCourseIcon(nombre: string): string {
    const n = (nombre || '').toLowerCase();
    for (const [key, icon] of Object.entries(this.iconMap)) {
      if (n.includes(key)) return icon;
    }
    return '📖';
  }

  get totalCursos() { return this.cursos.length; }
}

