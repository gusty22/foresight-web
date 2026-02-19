import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const configGuard: CanActivateFn = () => {
  const http = inject(HttpClient);
  const router = inject(Router);

  // Verifica se o usuário logado possui empresa vinculada no banco
  return http.get<any[]>('http://localhost:8080/api/empresas').pipe(
    map(empresas => {
      if (empresas && empresas.length > 0) {
        localStorage.setItem('empresaId', empresas[0].id.toString());
        return true;
      } else {
        // Redireciona para o cadastro obrigatório caso a lista esteja vazia
        router.navigate(['/sistema/empresas/cadastro']);
        return false;
      }
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};
