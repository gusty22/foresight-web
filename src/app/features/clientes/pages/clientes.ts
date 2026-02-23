import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.scss'
})
export class ClientesComponent implements OnInit {
  private http = inject(HttpClient);

  // State
  clientes = signal<any[]>([]);
  loading = signal(false);
  termoBusca = signal('');

  ngOnInit() {
    this.carregarClientes();
  }

  carregarClientes() {
    this.loading.set(true);
    const empresaId = localStorage.getItem('empresaId');

    // Simulação de delay para experiência de UI (Remover em prod se for rápido)
    // Aqui você conectará com: this.clienteService.listarPorEmpresa(empresaId)
    this.http.get<any[]>(`http://localhost:8080/api/clientes/${empresaId}`)
      .subscribe({
        next: (res) => {
          this.clientes.set(res);
          this.loading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.loading.set(false);
        }
      });
  }

  filtrarClientes() {
    // Lógica de filtro local ou chamada de API de busca
    const termo = this.termoBusca().toLowerCase();
    // Exemplo local, ideal é chamar o endpoint de busca do backend se for muitos dados
    if(!termo) {
      this.carregarClientes();
      return;
    }

    this.clientes.update(lista => lista.filter(c =>
      c.nome.toLowerCase().includes(termo) ||
      c.documento.includes(termo)
    ));
  }

  novoCliente() {
    // Lógica para abrir modal ou navegar para cadastro
    alert('Funcionalidade de cadastro em desenvolvimento/modal');
  }
}
