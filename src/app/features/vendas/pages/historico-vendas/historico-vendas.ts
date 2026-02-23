import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendaService, VendaDto } from '../../services/venda.service';
import { BrMaskPipe } from '../../../../shared/pipes/br-mask.pipe';

@Component({
  selector: 'app-historico-vendas',
  standalone: true,
  imports: [CommonModule, BrMaskPipe],
  templateUrl: './historico-vendas.html'
})
export class HistoricoVendasComponent implements OnInit {
  private vendaService = inject(VendaService);

  vendas = signal<VendaDto[]>([]);
  vendaSelecionada = signal<VendaDto | null>(null);
  exibirModal = signal(false);
  loading = signal(true);
  erro = signal<string | null>(null);

  ngOnInit() {
    this.carregarHistorico();
  }

  carregarHistorico() {
    this.loading.set(true);
    this.erro.set(null);

    this.vendaService.listarHistorico().subscribe({
      next: (res) => {
        this.vendas.set(res.data || []);
        this.loading.set(false);
      },
      error: () => {
        this.erro.set('Erro ao carregar o histórico de vendas.');
        this.loading.set(false);
      }
    });
  }

  // --- NOVA FUNCIONALIDADE: CONFIRMAR PAGAMENTO ---
  confirmarPagamento(venda: VendaDto) {
    if (venda.statusPagamento === 'PAGO') return;

    const confirmacao = confirm(`Deseja confirmar o recebimento de R$ ${venda.valorTotal} referente à venda #${venda.id}?`);

    if (confirmacao) {
      this.loading.set(true);
      this.vendaService.confirmarPagamento(venda.id).subscribe({
        next: () => {
          alert('Pagamento confirmado com sucesso!');
          this.carregarHistorico(); // Atualiza a lista para mostrar "PAGO"
          if (this.exibirModal()) this.fecharModal(); // Fecha modal se estiver aberto
        },
        error: (err) => {
          alert('Erro ao confirmar pagamento: ' + (err.error?.message || 'Erro desconhecido'));
          this.loading.set(false);
        }
      });
    }
  }

  verDetalhes(vendaId: number) {
    this.loading.set(true);
    this.vendaService.buscarDetalhes(vendaId).subscribe({
      next: (res) => {
        this.vendaSelecionada.set(res.data);
        this.exibirModal.set(true);
        this.loading.set(false);
      },
      error: (err) => {
        alert('Erro ao buscar detalhes: ' + (err.error?.message || 'Erro de conexão'));
        this.loading.set(false);
      }
    });
  }

  fecharModal() {
    this.exibirModal.set(false);
    this.vendaSelecionada.set(null);
  }

  baixarNotaFiscal(vendaId: number) {
    this.vendaService.downloadComprovante(vendaId).subscribe({
      next: (blob: Blob) => {
        const fileURL = URL.createObjectURL(blob);
        window.open(fileURL, '_blank');
      },
      error: () => alert('Erro ao gerar PDF. Verifique se a venda pertence à sua empresa.')
    });
  }
}
