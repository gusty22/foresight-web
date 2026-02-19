import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-historico-vendas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historico-vendas.html'
})
export class HistoricoVendasComponent implements OnInit {
  private http = inject(HttpClient);

  vendas = signal<any[]>([]);
  vendaSelecionada: any = null; // Guarda os detalhes da venda clicada
  exibirModal = signal(false);

  ngOnInit() {
    this.carregarHistorico();
  }

  carregarHistorico() {
    const empresaId = localStorage.getItem('empresaId');
    this.http.get<any[]>(`http://localhost:8080/api/vendas/${empresaId}`)
      .subscribe({
        next: (res) => this.vendas.set(res),
        error: (err) => console.error('Erro ao carregar histórico:', err)
      });
  }

  // Busca os detalhes completos (com itens) no backend
  verDetalhes(vendaId: number) {
    const empresaId = localStorage.getItem('empresaId');
    this.http.get<any>(`http://localhost:8080/api/vendas/detalhes/${vendaId}/${empresaId}`)
      .subscribe({
        next: (res) => {
          this.vendaSelecionada = res;
          this.exibirModal.set(true);
        },
        error: (err) => alert('Erro ao buscar detalhes: ' + (err.error?.message || 'Erro de conexão'))
      });
  }

  fecharModal() {
    this.exibirModal.set(false);
    this.vendaSelecionada = null;
  }

  // Baixa o PDF usando o token (Seguro)
  baixarNotaFiscal(vendaId: number) {
    const url = `http://localhost:8080/api/vendas/${vendaId}/comprovante`;
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const fileURL = URL.createObjectURL(blob);
        window.open(fileURL, '_blank');
      },
      error: () => alert('Erro ao gerar PDF. Verifique se a venda pertence à sua empresa.')
    });
  }
}
