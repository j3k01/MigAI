import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { TokenService } from '../../shared/services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7127/api/auth/login';

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { email, password }).pipe(
      tap(response => this.tokenService.saveToken(response.token))
    );
  }

  logout() {
    this.tokenService.removeToken();
  }

  isAuthenticated(): boolean {
    return !!this.tokenService.getToken();
  }
}
