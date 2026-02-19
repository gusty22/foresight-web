import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:8080/api/produtos';

  // O empresaId vai na URL conforme o Swagger: /api/produtos/{empresaId}
  salvar(produto: any, empresaId: number): Observable<any> {
    return this.http.post(`${this.API}/${empresaId}`, produto);
  }

  listarPorEmpresa(empresaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/${empresaId}`);
  }
}
