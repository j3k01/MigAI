import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChaptersComponent } from './chapters/chapters.component';
import { LessonsComponent } from './lessons/lessons.component';
import { authGuard } from './auth/guards/auth.guard';
import { RenderMode } from '@angular/ssr';
import { NotificationsComponent } from './notifications/notifications.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'chapters', component: ChaptersComponent },
    { path: 'lessons/:id', component: LessonsComponent, data: { RenderMode: 'server'} },
    { path: 'register', component: RegisterComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'notifications', component: NotificationsComponent },
    { path: '**', redirectTo: 'login' }
  ];
