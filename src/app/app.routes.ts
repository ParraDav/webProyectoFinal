import { Routes } from '@angular/router';

import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Cursos } from './components/cursos/cursos';
import { VerCurso } from './components/ver-curso/ver-curso';
import { MisCursos } from './components/mis-cursos/mis-cursos';
import { Metricas } from './components/metricas/metricas';
import { AdminUsuarios } from './components/admin-usuarios/admin-usuarios';
import { CrearCurso } from './components/crear-curso/crear-curso';
import { Perfil } from './components/perfil/perfil';

import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [

    {
        path: '',
        component: Home
    },

    {
        path: 'login',
        component: Login
    },

    {
        path: 'register',
        component: Register
    },

    {
        path: 'cursos',
        component: Cursos
    },

    {
        path: 'ver-curso/:id',
        component: VerCurso
    },

    // ── Rutas protegidas (requieren login) ──────────────────────────
    {
        path: 'mis-cursos',
        component: MisCursos,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['estudiante'] }
    },

    {
        path: 'crear-curso',
        component: CrearCurso,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['instructor', 'administrador'] }
    },

    {
        path: 'metricas',
        component: Metricas,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['instructor', 'administrador'] }
    },

    {
        path: 'admin-usuarios',
        component: AdminUsuarios,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['administrador'] }
    },

    {
        path: 'perfil',
        component: Perfil,
        canActivate: [authGuard]
    },

    {
        path: '**',
        redirectTo: ''
    }

];