import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {

  loginForm!: FormGroup;
  loading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    // Si ya está logueado, redirigir
    if (this.authService.isLoggedIn()) {
      this.redirectByRole(this.authService.getRol());
      return;
    }

    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email()    { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  togglePassword() { this.showPassword = !this.showPassword; }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        this.authService.guardarToken(res.token);
        this.authService.guardarRol(res.rol);
        this.toastr.success(`¡Bienvenido de vuelta!`, 'Sesión iniciada');
        this.redirectByRole(res.rol);
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.error?.mensaje ?? 'Error al iniciar sesión';
        this.toastr.error(msg, 'Error');
      }
    });
  }

  private redirectByRole(rol: string | null) {
    if (rol === 'administrador') {
      this.router.navigate(['/admin-usuarios']);
    } else if (rol === 'instructor') {
      this.router.navigate(['/metricas']);
    } else {
      this.router.navigate(['/cursos']);
    }
  }
}