import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-empresas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './empresas.html'
})
export class EmpresasComponent implements OnInit {
  private http = inject(HttpClient);

  // Lista de empresas para o *ngFor (Resolve o erro TS2551)
  listaDeEmpresas = signal<any[]>([]);

  // Objeto para o formulário de cadastro
  novaEmpresa = {
    nome: '',
    proLaboreDesejado: 0,
    tipo: 'SERVICO'
  };

  loading = signal(false);

  ngOnInit() {
    this.carregarEmpresas();
  }

  carregarEmpresas() {
    // Endpoint conforme Swagger: GET /api/empresas
    this.http.get<any[]>('http://localhost:8080/api/empresas')
      .subscribe({
        next: (res) => this.listaDeEmpresas.set(res),
        error: (err) => console.error('Erro ao buscar empresas', err)
      });
  }

  salvarEmpresa() {
    this.loading.set(true);
    this.http.post('http://localhost:8080/api/empresas', this.novaEmpresa)
      .subscribe({
        next: (res: any) => {
          alert('Empresa cadastrada com sucesso!');
          localStorage.setItem('empresaId', res.id); // Salva o ID real para uso no Dashboard
          this.novaEmpresa = { nome: '', proLaboreDesejado: 0, tipo: 'SERVICO' };
          this.carregarEmpresas();
          this.loading.set(false);
        },
        error: (err) => {
          alert('Erro ao salvar empresa: ' + err.status);
          this.loading.set(false);
        }
      });
  }
}
