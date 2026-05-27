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
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {

  registerForm!: FormGroup;
  loading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
      return;
    }

    this.registerForm = this.fb.group({
      nombre:   ['', [Validators.required, Validators.minLength(2)]],
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rol:      ['estudiante', Validators.required]
    });
  }

  get nombre()   { return this.registerForm.get('nombre'); }
  get email()    { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get rol()      { return this.registerForm.get('rol'); }

  togglePassword() { this.showPassword = !this.showPassword; }

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.toastr.success('¡Cuenta creada! Ya puedes iniciar sesión.', 'Registro exitoso');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.error?.mensaje ?? 'Error al registrar usuario';
        this.toastr.error(msg, 'Error');
      }
    });
  }
}