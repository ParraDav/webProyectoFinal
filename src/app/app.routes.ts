import { Routes } from '@angular/router';

import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Cursos } from './components/cursos/cursos';
import { VerCurso } from './components/ver-curso/ver-curso';
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

    {
        path: '**',
        redirectTo: ''
    }

];