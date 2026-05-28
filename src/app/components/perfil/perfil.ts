import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/usuario-service';
import { AuthService } from '../../services/auth-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil implements OnInit {

  perfilForm!: FormGroup;
  loading = true;
  saving = false;
  rol: string | null = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private auth: AuthService,
    private toastr: ToastrService
  ) {
    this.perfilForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.rol = this.auth.getRol();
    this.cargarPerfil();
  }

  cargarPerfil() {
    this.loading = true;
    this.usuarioService.obtenerPerfil().subscribe({
      next: (data) => {
        this.perfilForm.patchValue({
          nombre: data.nombre,
          email: data.email
        });
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error('Error al cargar la información del perfil', 'Error');
      }
    });
  }

  guardar() {
    if (this.perfilForm.invalid) {
      this.perfilForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    const rawValue = this.perfilForm.value;
    
    const updateData: any = {
      nombre: rawValue.nombre,
      email: rawValue.email
    };
    if (rawValue.password && rawValue.password.trim() !== '') {
      updateData.password = rawValue.password;
    }

    this.usuarioService.actualizarPerfil(updateData).subscribe({
      next: (res) => {
        this.saving = false;
        this.toastr.success('Perfil actualizado correctamente', 'Éxito');
        this.perfilForm.get('password')?.reset();
      },
      error: (err) => {
        this.saving = false;
        const msg = err?.error?.mensaje ?? 'Error al actualizar el perfil';
        this.toastr.error(msg, 'Error');
      }
    });
  }
}
