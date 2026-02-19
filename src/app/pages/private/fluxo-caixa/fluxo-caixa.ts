import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-fluxo-caixa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fluxo-caixa.html',
  styleUrl: './fluxo-caixa.scss'
})
export class FluxoCaixaComponent implements OnInit {
  private http = inject(HttpClient);

  movimentacoes = signal<any[]>([]);
  saldoTotal = signal(0);

  ngOnInit() {
    this.carregarFluxo();
  }

  carregarFluxo() {
    const empresaId = localStorage.getItem('empresaId');
    this.http.get<any[]>(`http://localhost:8080/api/fluxo-caixa/${empresaId}`)
      .subscribe(res => {
        this.movimentacoes.set(res);
        // Calcular saldo simples baseada na lista carregada (ou vir do back)
        const saldo = res.reduce((acc, item) => {
          return item.tipo === 'ENTRADA' ? acc + item.valor : acc - item.valor;
        }, 0);
        this.saldoTotal.set(saldo);
      });
  }
}
