import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule  } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,RouterModule],
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
      error: err => this.errorMessage = err.errorMessage
    });
  }

  goToRegister() {
    this.router.navigate(['/register']); 
  }
}
