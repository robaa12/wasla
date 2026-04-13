import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Dashboard } from './dashboard/dashboard';
import { Analytics } from './analytics/analytics';
import { authGuard } from './core/auth/auth.guard';
import { redirectIfAuthenticatedGuard } from './core/auth/redirect-if-authenticated.guard';

export const routes: Routes = [
    { path: 'login', component: Login, canActivate: [redirectIfAuthenticatedGuard] },
    { path: 'register', component: Login, canActivate: [redirectIfAuthenticatedGuard] },
    { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
    { path: 'analytics/:id', component: Analytics, canActivate: [authGuard] },
];
