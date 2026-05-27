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

  private iconMap: Record<string, string> = {
    react: '⚛️', angular: '🅰️', node: '🟢', python: '🐍',
    javascript: '🟨', css: '🎨', html: '🌐', java: '☕',
    typescript: '💙', sql: '🗄️', docker: '🐳', git: '🔀',
    diseño: '✏️', marketing: '📣', datos: '📊', machine: '🤖',
    inteligencia: '🧠', seguridad: '🔒', cloud: '☁️'
  };

  constructor(private cursoService: CursoService) {}

  ngOnInit() {
    this.cursoService.getCursosPublicos().subscribe({
      next: (data) => { this.cursos = data; this.cargando = false; },
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
}