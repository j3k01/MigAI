import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
    private readonly KEY = 'authToken';

    saveToken(token: string): void {
        localStorage.setItem(this.KEY, token);
    }

    getToken(): string | null {
        return localStorage.getItem(this.KEY);
    }

    removeToken(): void {
        localStorage.removeItem(this.KEY);
    }
}
