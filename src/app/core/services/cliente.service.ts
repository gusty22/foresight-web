import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private http = inject(HttpClient);
  // Você precisará criar o Controller no Java depois se quiser o autocomplete funcionar de verdade,
  // mas por enquanto isso estrutura o código.
  private API = 'http://localhost:8080/api/clientes';

  buscarPorTermo(empresaId: number, termo: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/${empresaId}/buscar?termo=${termo}`);
  }
}
