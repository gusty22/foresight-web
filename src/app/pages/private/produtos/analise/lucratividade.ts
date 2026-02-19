import { Component, OnInit, inject, signal } from '@angular/core'; // IMPORTAÇÃO CORRIGIDA PARA @angular/core
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-lucratividade',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './lucratividade.html'
})
export class LucratividadeComponent implements OnInit {
  private http = inject(HttpClient);

  // Signals para armazenar dados reativos
  relatorio = signal<any[]>([]);
  saudeFinanceira = signal<any>({ disponivelParaVoce: 0, despesasComprometidas: 0 });

  // Estados dos Simuladores
  simulador = { custo: 0, preco: 0, resultado: null as any };
  metas = { prolaboreDesejado: 2000, produtoSelecionado: null as any, unidadesNecessarias: 0 };

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    const empresaId = 1;

    // Tipagem 'any[]' e 'any' para satisfazer o modo estrito do TS
    this.http.get<any[]>(`http://localhost:8080/api/relatorios/lucratividade/${empresaId}`)
      .subscribe((res: any[]) => this.relatorio.set(res));

    this.http.get<any>(`http://localhost:8080/api/relatorios/saude-financeira/${empresaId}`)
      .subscribe((res: any) => this.saudeFinanceira.set(res));
  }

  simularImpacto() {
    this.http.get<any>(`http://localhost:8080/api/relatorios/simulador`, {
      params: {
        custo: this.simulador.custo.toString(),
        precoVenda: this.simulador.preco.toString(),
        fixas: this.saudeFinanceira().despesasComprometidas.toString()
      }
    }).subscribe((res: any) => this.simulador.resultado = res);
  }

  calcularMetaUnidades() {
    if (this.metas.produtoSelecionado) {
      const lucroUnitario = this.metas.produtoSelecionado.lucroUnitario;
      if (lucroUnitario > 0) {
        this.metas.unidadesNecessarias = Math.ceil(this.metas.prolaboreDesejado / lucroUnitario);
      } else {
        this.metas.unidadesNecessarias = 0;
      }
    }
  }
}
