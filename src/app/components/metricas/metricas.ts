import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricasService, MetricasInstructor, MetricasAdmin } from '../../services/metricas-service';
import { AuthService } from '../../services/auth-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-metricas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './metricas.html',
  styleUrl: './metricas.css',
})
export class Metricas implements OnInit {
  rol: string = '';
  loading = true;

  metricasInst: MetricasInstructor | null = null;
  metricasAdmin: MetricasAdmin | null = null;

  todayDate: string = '';

  constructor(
    private metricasService: MetricasService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.rol = this.authService.getRol() || '';
    this.todayDate = new Date().toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    // Capitalizar la primera letra de la fecha
    this.todayDate = this.todayDate.charAt(0).toUpperCase() + this.todayDate.slice(1);
    this.cargarMetricas();
  }

  cargarMetricas() {
    this.loading = true;
    if (this.rol === 'administrador') {
      this.metricasService.obtenerMetricasAdmin().subscribe({
        next: (resAdmin) => {
          this.metricasAdmin = resAdmin;
          this.metricasService.obtenerMetricasInstructor().subscribe({
            next: (resInst) => {
              this.metricasInst = resInst;
              this.loading = false;
            },
            error: () => {
              this.loading = false;
            }
          });
        },
        error: (err) => {
          this.loading = false;
          this.toastr.error('Error al obtener métricas globales', 'Error');
        }
      });
    } else if (this.rol === 'instructor') {
      this.metricasService.obtenerMetricasInstructor().subscribe({
        next: (resInst) => {
          this.metricasInst = resInst;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.toastr.error('Error al obtener tus métricas', 'Error');
        }
      });
    } else {
      this.loading = false;
    }
  }

  get conversionRate(): number {
    if (!this.metricasAdmin || !this.metricasAdmin.totalUsuarios) return 0;
    const rate = (this.metricasAdmin.totalInscripciones / this.metricasAdmin.totalUsuarios) * 100;
    return Math.min(Math.round(rate), 100);
  }

  get promedioModulosPorCurso(): number {
    if (!this.metricasInst || !this.metricasInst.totalCursos) return 0;
    return this.metricasInst.totalModulos / this.metricasInst.totalCursos;
  }

  get promedioEstudiantesPorCurso(): number {
    if (!this.metricasInst || !this.metricasInst.totalCursos) return 0;
    return this.metricasInst.totalEstudiantesInscritos / this.metricasInst.totalCursos;
  }
}
