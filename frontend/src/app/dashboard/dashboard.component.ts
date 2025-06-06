import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../shared/services/token.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  title = 'Panel użytkownika';
  userProgress: number = 0;
  badges: { name: string, description: string, icon: string }[] = [];

  constructor(
    private router: Router,
    private tokenService: TokenService,
    private http: HttpClient,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.loadUserProgress();
    this.loadUserBadges();
  }

  loadUserProgress() {
    const userId = this.auth.getUserId();
    if (userId === null) {
      alert('Musisz być zalogowany, żeby dodać komentarz.');
      return;
    }

    this.http.get<{ progress: number }>(`https://localhost:7127/api/userprogress/progress/${userId}`)
      .subscribe({
        next: (data: { progress: number }) => {
          this.userProgress = data.progress;
        },
        error: (err: any) => console.error("🚨 Błąd pobierania postępu:", err)
      });
  }

  loadUserBadges() {
    const userId = this.auth.getUserId();
    if (userId === null) {
      alert('Musisz być zalogowany, żeby dodać komentarz.');
      return;
    }

    this.http.get<{ name: string, description: string, icon: string }[]>(
      `https://localhost:7127/api/userprogress/Badges/${userId}`
    ).subscribe({
      next: (data) => {
        this.badges = data;
      },
      error: (err) => console.error("🚨 Błąd pobierania odznak:", err)
    });
  }

  logout() {
    this.tokenService.removeToken();
    this.router.navigate(['/login']);
  }

  lessons() {
    //this.tokenService.removeToken();
    this.router.navigate(['/chapters']);
  }

  notifications() {
    this.router.navigate(['/notifications']);
  }

  progress() {
    this.router.navigate(['/progress']);
  }
}
