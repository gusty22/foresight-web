import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  empresaIdAtiva = signal<number | null>(null);

  login(dados: any) {
    return this.http.post<any>('http://localhost:8080/api/auth/login', dados).pipe(
      tap(res => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          this.verificarEmpresaEVincular();
        }
      })
    );
  }

  verificarEmpresaEVincular() {
    this.http.get<any[]>('http://localhost:8080/api/empresas').subscribe({
      next: (empresas) => {
        if (empresas && empresas.length > 0) {
          const id = empresas[0].id;
          this.empresaIdAtiva.set(id);
          localStorage.setItem('empresaId', id.toString());
          this.router.navigate(['/sistema/dashboard']);
        } else {
          this.router.navigate(['/sistema/empresas/cadastro']);
        }
      },
      error: () => this.router.navigate(['/login'])
    });
  }

  temEmpresa(): boolean {
    return !!localStorage.getItem('empresaId');
  }

  estaLogado(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.clear();
    this.empresaIdAtiva.set(null);
    this.router.navigate(['/login']);
  }
}
