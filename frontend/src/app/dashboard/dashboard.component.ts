import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../shared/services/token.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  title = 'Panel użytkownika';

  constructor(private router: Router, private tokenService: TokenService) {}

  logout() {
    this.tokenService.removeToken();
    this.router.navigate(['/login']);
  }
}
