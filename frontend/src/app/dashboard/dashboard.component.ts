import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../shared/services/token.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ CommonModule ],
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

  lessons() {
    this.tokenService.removeToken();
    this.router.navigate(['/chapters']);
  }

}
