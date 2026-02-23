import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { LoginRequest, TokenResponse } from './models/auth.model';
import { ApiResponse } from '../http/api-response.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly API = 'http://localhost:8080/api/auth';
  private readonly TOKEN_KEY = 'auth_token';

  login(dados: LoginRequest) {
    return this.http.post<ApiResponse<TokenResponse>>(`${this.API}/login`, dados).pipe(
      tap(res => {
        if (res.data?.token) {
          localStorage.setItem(this.TOKEN_KEY, res.data.token);
          this.router.navigate(['/sistema/dashboard']);
        }
      })
    );
  }

  estaLogado(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  // Mantido para não quebrar o seu private-layout.html.
  // Na nossa arquitetura, se ele está logado, ele TEM empresa garantida pelo Backend.
  temEmpresa(): boolean {
    return this.estaLogado();
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
