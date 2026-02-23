import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/http/api-response.model';

export interface ItemVendaDto {
  produtoId: number;
  produtoNome?: string;
  quantidade: number;
  precoUnitario: number;
  subtotal?: number;
}

export interface VendaDto {
  id: number; // Obrigatoriamente number agora (resolve o erro TS2345)
  clienteNome: string;
  clienteDocumento?: string;
  valorTotal: number;
  data: string;
  formaPagamento: string;
  statusPagamento: string;
  itens?: ItemVendaDto[];
}

export interface VendaRequest {
  cliente: {
    nome: string;
    documento?: string;
    telefone?: string;
  };
  itens: ItemVendaDto[];
  formaPagamento: string;
  status: string;
  dataPrevisao?: string;
}

@Injectable({ providedIn: 'root' })
export class VendaService {
  private http = inject(HttpClient);
  // ROTA CEGA E SEGURA: O Backend descobre a empresa via JWT.
  private readonly API = 'http://localhost:8080/api/vendas';

  realizarVenda(request: VendaRequest): Observable<ApiResponse<VendaDto>> {
    return this.http.post<ApiResponse<VendaDto>>(this.API, request);
  }

  listarHistorico(): Observable<ApiResponse<VendaDto[]>> {
    return this.http.get<ApiResponse<VendaDto[]>>(this.API);
  }

  buscarDetalhes(vendaId: number): Observable<ApiResponse<VendaDto>> {
    return this.http.get<ApiResponse<VendaDto>>(`${this.API}/${vendaId}/detalhes`);
  }

  downloadComprovante(vendaId: number): Observable<Blob> {
    return this.http.get(`${this.API}/${vendaId}/comprovante`, { responseType: 'blob' });
  }

  // Adicione este método dentro da classe VendaService
  confirmarPagamento(id: number): Observable<void> {
    // Endpoint sugerido para o backend: PUT /api/vendas/{id}/confirmar-pagamento
    return this.http.put<void>(`http://localhost:8080/api/vendas/${id}/confirmar-pagamento`, {});
  }

}


