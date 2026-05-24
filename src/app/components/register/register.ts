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
  selector: 'app-register',
  standalone: true,
  imports: [
    Navbar,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})

export class Register {

  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {

    this.registerForm = this.fb.group({

      nombre: [''],
      email: [''],
      password: [''],
      rol: ['estudiante']

    });

  }

  register() {

    this.authService
      .register(this.registerForm.value)
      .subscribe({

        next: (res: any) => {

          console.log(res);

          alert('Usuario registrado');

          this.router.navigate(['/login']);

        },

        error: (err) => {

          console.log(err);

          alert('Error al registrar');

        }

      });
  }
}