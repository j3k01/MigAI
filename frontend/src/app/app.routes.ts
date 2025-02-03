import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component'; // 🔥 POPRAWNA ŚCIEŻKA
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: 'login' }
  ];
