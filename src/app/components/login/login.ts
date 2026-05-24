import { Component } from '@angular/core';

import { Navbar } from '../navbar/navbar';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';

import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';

import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    Navbar,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {

  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {

    this.loginForm = this.fb.group({

      email: [''],
      password: ['']

    });

  }

  login() {

    this.authService
      .login(this.loginForm.value)
      .subscribe({

        next: (res: any) => {

          console.log(res);

          // Guardar token
          localStorage.setItem(
            'token',
            res.token
          );

          // Guardar rol
          localStorage.setItem(
            'rol',
            res.rol
          );

          alert('Login exitoso');

          this.router.navigate(['/cursos']);

        },

        error: (err) => {

          console.log(err);

          alert('Credenciales incorrectas');

        }

      });
  }
}