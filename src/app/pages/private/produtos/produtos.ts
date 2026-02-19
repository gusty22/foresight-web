import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './produtos.html',
  styleUrl: './produtos.scss'
})
export class ProdutosComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  listaOriginal = signal<any[]>([]);
  loading = signal(false);
  termoPesquisa = signal('');

  paginaAtual = signal(1);
  itensPorPagina = signal(10);

  exibirModalEdicao = signal(false);
  produtoParaEdicao: any = null;

  exibicaoCusto = '';
  exibicaoVenda = '';
  novoProduto: any = { nome: '', precoCusto: null, precoVenda: null, estoqueAtual: null };

  ngOnInit() {
    this.listarProdutos();
  }

  // --- Lógica de Filtro e Paginação ---
  produtosFiltrados = computed(() => {
    const termo = this.termoPesquisa().toLowerCase();
    return this.listaOriginal().filter(p =>
      p.nome.toLowerCase().includes(termo) ||
      (p.alertaStatus && p.alertaStatus.toLowerCase().includes(termo))
    );
  });

  produtosPaginados = computed(() => {
    const inicio = (this.paginaAtual() - 1) * this.itensPorPagina();
    return this.produtosFiltrados().slice(inicio, inicio + this.itensPorPagina());
  });

  totalPaginas = computed(() => Math.ceil(this.produtosFiltrados().length / this.itensPorPagina()));

  // --- CRUD ---
  listarProdutos() {
    const empresaId = this.authService.empresaIdAtiva() || localStorage.getItem('empresaId');
    if (!empresaId) return;

    this.loading.set(true);
    this.http.get<any[]>(`http://localhost:8080/api/produtos/${empresaId}`)
      .subscribe({
        next: (res) => {
          this.listaOriginal.set(res);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }

  salvarProduto(event: Event) {
    event.preventDefault();
    const empresaId = localStorage.getItem('empresaId');
    this.http.post(`http://localhost:8080/api/produtos/${empresaId}`, this.novoProduto)
      .subscribe({
        next: () => {
          alert('Produto cadastrado com sucesso!');
          this.novoProduto = { nome: '', precoCusto: null, precoVenda: null, estoqueAtual: null };
          this.exibicaoCusto = ''; this.exibicaoVenda = '';
          this.listarProdutos();
        },
        error: (err) => alert('Erro: ' + err.status)
      });
  }

  confirmarEdicao() {
    if (!this.produtoParaEdicao || !this.produtoParaEdicao.id) {
      alert('Erro: Produto inválido para edição.');
      return;
    }

    // ATENÇÃO: Se o erro 405 persistir, seu Backend Java precisa adicionar @PutMapping("/{id}") no Controller.
    // O Frontend está enviando corretamente para: .../api/produtos/123
    this.http.put(`http://localhost:8080/api/produtos/${this.produtoParaEdicao.id}`, this.produtoParaEdicao)
      .subscribe({
        next: () => {
          alert('Produto atualizado!');
          this.fecharModal();
          this.listarProdutos();
        },
        error: (err) => {
          console.error('Erro detalhado:', err);
          // Fallback: Se o PUT falhar com 405, tenta POST (alguns backends usam POST para tudo)
          if (err.status === 405) {
            alert('Erro Técnico: O servidor recusou a atualização (Erro 405). Verifique se o Backend aceita PUT.');
          } else {
            alert('Erro ao atualizar produto.');
          }
        }
      });
  }

  excluirProduto(id: number) {
    if (confirm('Tem certeza? Isso pode afetar o histórico de vendas.')) {
      this.http.delete(`http://localhost:8080/api/produtos/${id}`).subscribe(() => this.listarProdutos());
    }
  }

  abrirEdicao(produto: any) {
    this.produtoParaEdicao = { ...produto };
    this.exibicaoCusto = this.formatarValor(produto.precoCusto);
    this.exibicaoVenda = this.formatarValor(produto.precoVenda);
    this.exibirModalEdicao.set(true);
  }

  fecharModal() {
    this.exibirModalEdicao.set(false);
    this.produtoParaEdicao = null;
  }

  // --- Utilitários ---
  formatarMoeda(event: any, campo: 'custo' | 'venda', obj: any = this.novoProduto) {
    let valor = event.target.value.replace(/\D/g, '');
    valor = (Number(valor) / 100).toFixed(2) + '';
    valor = valor.replace(".", ",").replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,").replace(/(\d)(\d{3}),/g, "$1.$2,");

    if (campo === 'custo') {
      this.exibicaoCusto = valor;
      obj.precoCusto = Number(valor.replace(/\./g, '').replace(',', '.'));
    } else {
      this.exibicaoVenda = valor;
      obj.precoVenda = Number(valor.replace(/\./g, '').replace(',', '.'));
    }
  }

  formatarValor(valor: number) {
    return valor ? valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00';
  }
}
