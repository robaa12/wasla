import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Dashboard } from './dashboard/dashboard';

export const routes: Routes = [
    { path: 'login', component: Login },
    { path: 'register', component: Login },
    { path: 'dashboard', component: Dashboard },
];
