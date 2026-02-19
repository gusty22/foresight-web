import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Adicionado HttpHeaders
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-despesas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './despesas.html',
  styleUrl: './despesas.scss'
})
export class DespesasComponent implements OnInit {
  private http = inject(HttpClient);

  // Lista de despesas usando signals para performance reativa
  listaDespesas = signal<any[]>([]);

  // Objeto vinculado ao formulário no HTML via ngModel
  novaDespesa = {
    descricao: '',
    valor: 0,
    ehPessoal: false,
    data: new Date().toISOString().substring(0, 10),
    tipo: 'VARIAVEL'
  };

  loading = true;

  ngOnInit() {
    this.carregarDadosIniciais();
  }

  carregarDadosIniciais() {
    this.carregarDespesas();
  }

  carregarDespesas() {
    const empresaId = 1; // ID da empresa do Usuário 1

    // Para o GET também é necessário o token se o endpoint estiver protegido
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>(`http://localhost:8080/api/despesas/empresa/${empresaId}`, { headers })
      .subscribe({
        next: (res: any[]) => {
          this.listaDespesas.set(res);
          this.loading = false;
        },
        error: (err) => {
          console.error('Erro ao carregar despesas:', err);
          this.loading = false;
        }
      });
  }

  salvarDespesa() {
    const empresaId = 1;
    const token = localStorage.getItem('token');

    // Define o payload que estava faltando
    const payload = {
      ...this.novaDespesa,
      empresaId: empresaId
    };

    // Configuração correta dos headers para evitar o Erro 403
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post(`http://localhost:8080/api/despesas`, payload, { headers })
      .subscribe({
        next: () => {
          alert('Despesa registrada com sucesso!');
          this.resetForm();
          this.carregarDespesas();
        },
        error: (err) => {
          console.error('Erro ao salvar despesa:', err);
          alert('Erro ao salvar: Certifique-se de estar logado corretamente.');
        }
      });
  }

  resetForm() {
    this.novaDespesa = {
      descricao: '',
      valor: 0,
      ehPessoal: false,
      data: new Date().toISOString().substring(0, 10),
      tipo: 'VARIAVEL'
    };
  }
}
