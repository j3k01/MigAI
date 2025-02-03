import { Component } from '@angular/core';
import { Router, RouterModule} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms'
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  userEmail = '';
  hashedPassword = '';
  confirmPassword = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    if (this.hashedPassword !== this.confirmPassword) {
      this.errorMessage = "Hasła nie są takie same!";
      return;
    }

    this.authService.register(this.userEmail, this.hashedPassword).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: err => this.errorMessage = err.errorMessage
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
