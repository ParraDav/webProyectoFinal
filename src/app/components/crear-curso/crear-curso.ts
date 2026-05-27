import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CursoService } from '../../services/curso-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-crear-curso',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './crear-curso.html',
  styleUrl: './crear-curso.css'
})
export class CrearCurso implements OnInit {

  cursoForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private cursoService: CursoService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.cursoForm = this.fb.group({
      nombre:      ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      estado:      ['borrador', Validators.required]
    });
  }

  get nombre()      { return this.cursoForm.get('nombre'); }
  get descripcion() { return this.cursoForm.get('descripcion'); }

  crear() {
    if (this.cursoForm.invalid) {
      this.cursoForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.cursoService.crearCurso(this.cursoForm.value).subscribe({
      next: (res: any) => {
        this.toastr.success('¡Curso creado exitosamente!', '✅');
        // Redirigir al editor del curso recién creado
        this.router.navigate(['/ver-curso', res._id]);
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error(err?.error?.mensaje ?? 'Error al crear el curso', 'Error');
      }
    });
  }
}
