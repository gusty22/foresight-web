import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);

  // Estado único para dados do dashboard (Signal)
  dashboardData = signal({
    faturamentoMensal: 0,
    lucroLiquido: 0,
    novosClientes: 0,
    itensCriticos: 0,
    saldoAtual: 0,
    metaMinima: 2000, // Exemplo de custo fixo
    percentualMeta: 0,
    faltaParaMeta: 0,
    ultimasMovimentacoes: [] as any[]
  });

  ngOnInit() {
    this.carregarDadosReais();
  }

  carregarDadosReais() {
    const empresaId = localStorage.getItem('empresaId');
    if (!empresaId) return;

    // AQUI VOCÊ CONECTARÁ SEUS ENDPOINTS FUTURAMENTE
    // Por enquanto, vou simular a busca para o design aparecer perfeito
    // Subistitua isso pelas chamadas: this.vendaService.obterFaturamento()...

    // Simulação de delay de rede
    setTimeout(() => {
      this.dashboardData.set({
        faturamentoMensal: 12450.00, // Substituir pelo back
        lucroLiquido: 4280.00,       // Substituir pelo back
        novosClientes: 18,           // Substituir pelo back
        itensCriticos: 3,            // Substituir pelo back
        saldoAtual: 538.20,          // Substituir pelo back
        metaMinima: 2000.00,         // Definido no cadastro da empresa
        percentualMeta: 75,          // Calculado: (saldo / meta) * 100
        faltaParaMeta: 1461.80,      // Calculado
        ultimasMovimentacoes: [
          { descricao: 'Venda #1023 - Agro Adca', categoria: 'Venda', dataHora: new Date(), valor: 570.00, tipo: 'ENTRADA' },
          { descricao: 'Conta de Luz', categoria: 'Despesa Fixa', dataHora: new Date(), valor: 150.00, tipo: 'SAIDA' },
          { descricao: 'Venda #1022 - Cliente Balcão', categoria: 'Venda', dataHora: new Date(), valor: 45.00, tipo: 'ENTRADA' },
          { descricao: 'Reposição Estoque', categoria: 'Fornecedor', dataHora: new Date(), valor: 800.00, tipo: 'SAIDA' }
        ]
      });
    }, 500);
  }
}
