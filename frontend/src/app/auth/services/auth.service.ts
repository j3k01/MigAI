import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { TokenService } from '../../shared/services/token.service';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub?: string;
  userId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7127/api/auth/login';

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { email, password }).pipe(
      tap(response => this.tokenService.saveToken(response.token))
    );
  }

  logout() {
    this.tokenService.removeToken();
  }

  register(userEmail: string, hashedPassword: string): Observable<any> {
    return this.http.post<any>('https://localhost:7127/api/user/register', { userEmail, hashedPassword });
  }

  isAuthenticated(): boolean {
    return !!this.tokenService.getToken();
  }

  getUserId(): number | null {
    const token = this.tokenService.getToken();
    if (!token) return null;
    try {
      const payload = jwtDecode<JwtPayload>(token);
      return payload.userId ?? (payload.sub ? +payload.sub : null);
    } catch {
      return null;
    }
  }
}
