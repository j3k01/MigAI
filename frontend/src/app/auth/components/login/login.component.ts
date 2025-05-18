import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule  } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,RouterModule, CommonModule],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  email = ''
  password = ''
  errorMessage = ''

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: err => { console.error('Login error', err);
        this.errorMessage = err.error?.errorMessage || 'Nieprawidłowy email lub hasło!';
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']); 
  }
}
