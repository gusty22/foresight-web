import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { VendaService, VendaRequest } from '../services/venda.service';
// Pipe removido dos imports, pois a formatação aqui é via evento de input (UX de digitação)

@Component({
  selector: 'app-vendas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendas.html',
  styleUrls: ['./vendas.scss']
})
export class VendasComponent implements OnInit {
  private http = inject(HttpClient);
  private vendaService = inject(VendaService);

  loading = signal(false);
  showSuccessModal = signal(false);
  ultimoIdVenda: number | null = null;

  cliente = { nome: '', documento: '', telefone: '' };
  carrinho = signal<any[]>([]);

  formaPagamento = 'DINHEIRO';
  statusPagamento = 'PAGO';
  dataPrevisao: string = '';
  numeroPedido = '---';

  produtosDisponiveis = signal<any[]>([]);
  produtoSelecionado: any = null;
  quantidadeSelecionada: number = 1;
  termoBuscaProduto = '';

  ngOnInit() {
    this.carregarProdutos();
  }

  carregarProdutos() {
    this.http.get<any>('http://localhost:8080/api/produtos').subscribe({
      next: (res) => this.produtosDisponiveis.set(res.data ? res.data : res),
      error: () => console.error("Falha ao buscar produtos.")
    });
  }

  // --- MÁSCARAS DE DIGITAÇÃO (UX) ---

  formatarTelefone(event: Event) {
    const input = event.target as HTMLInputElement;
    let v = input.value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 10) {
      v = v.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else {
      v = v.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    }
    this.cliente.telefone = v;
    input.value = v;
  }

  formatarDocumento(event: Event) {
    const input = event.target as HTMLInputElement;
    let v = input.value.replace(/\D/g, "");
    if (v.length > 14) v = v.slice(0, 14);
    if (v.length <= 11) {
      v = v.replace(/(\d{3})(\d)/, "$1.$2");
      v = v.replace(/(\d{3})(\d)/, "$1.$2");
      v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
      v = v.replace(/^(\d{2})(\d)/, "$1.$2");
      v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
      v = v.replace(/(\d{4})(\d)/, "$1-$2");
    }
    this.cliente.documento = v;
    input.value = v;
  }

  // --- LÓGICA DE NEGÓCIO ---

  produtosFiltrados = computed(() => {
    const termo = this.termoBuscaProduto.toLowerCase();
    return this.produtosDisponiveis().filter(p => p.nome.toLowerCase().includes(termo));
  });

  selecionarProduto(produto: any) {
    this.produtoSelecionado = produto;
    this.quantidadeSelecionada = 1;
  }

  adicionarAoCarrinho() {
    if (!this.produtoSelecionado) return;

    if (this.quantidadeSelecionada > this.produtoSelecionado.estoqueAtual) {
      alert(`Estoque insuficiente! Disponível: ${this.produtoSelecionado.estoqueAtual}`);
      return;
    }

    const itemExistente = this.carrinho().find(i => i.id === this.produtoSelecionado.id);
    if (itemExistente) {
      if ((itemExistente.quantidade + this.quantidadeSelecionada) > this.produtoSelecionado.estoqueAtual) {
        alert('A soma da quantidade excede o estoque!');
        return;
      }
      this.carrinho.update(itens => itens.map(i =>
        i.id === this.produtoSelecionado.id
          ? { ...i, quantidade: i.quantidade + this.quantidadeSelecionada, subtotal: (i.quantidade + this.quantidadeSelecionada) * i.precoVenda }
          : i
      ));
    } else {
      this.carrinho.update(itens => [
        ...itens,
        { ...this.produtoSelecionado, quantidade: this.quantidadeSelecionada, subtotal: this.produtoSelecionado.precoVenda * this.quantidadeSelecionada }
      ]);
    }

    this.produtoSelecionado = null;
    this.quantidadeSelecionada = 1;
    this.termoBuscaProduto = '';
  }

  removerDoCarrinho(index: number) {
    this.carrinho.update(itens => itens.filter((_, i) => i !== index));
  }

  totalPedido = computed(() => {
    return this.carrinho().reduce((acc, item) => acc + item.subtotal, 0);
  });

  finalizarVenda() {
    if (!this.cliente.nome) { alert('Informe o Nome do Cliente.'); return; }
    if (this.carrinho().length === 0) { alert('Carrinho vazio.'); return; }
    if (this.statusPagamento === 'PENDENTE' && !this.dataPrevisao) {
      alert('Informe a Data de Previsão para pagamento pendente.');
      return;
    }

    this.loading.set(true);

    const payload: VendaRequest = {
      cliente: {
        nome: this.cliente.nome,
        // Sanitização: Remove a máscara antes de enviar para o banco
        documento: this.cliente.documento.replace(/\D/g, ''),
        telefone: this.cliente.telefone.replace(/\D/g, '')
      },
      itens: this.carrinho().map(i => ({
        produtoId: i.id,
        quantidade: i.quantidade,
        precoUnitario: i.precoVenda
      })),
      formaPagamento: this.formaPagamento,
      status: this.statusPagamento,
      dataPrevisao: this.dataPrevisao || undefined
    };

    this.vendaService.realizarVenda(payload).subscribe({
      next: (res) => {
        this.ultimoIdVenda = res.data.id;
        setTimeout(() => {
          this.loading.set(false);
          this.showSuccessModal.set(true);
          this.carregarProdutos();
        }, 1000);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
        alert('Erro ao processar venda: ' + (err.error?.message || 'Erro desconhecido.'));
      }
    });
  }

  baixarNotaFiscal() {
    if (!this.ultimoIdVenda) return;
    this.loading.set(true);
    this.vendaService.downloadComprovante(this.ultimoIdVenda).subscribe({
      next: (blob: Blob) => {
        const fileURL = URL.createObjectURL(blob);
        window.open(fileURL, '_blank');
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        alert('Não foi possível gerar o PDF. Verifique suas permissões.');
      }
    });
  }

  novaVenda() {
    this.carrinho.set([]);
    this.cliente = { nome: '', documento: '', telefone: '' };
    this.statusPagamento = 'PAGO';
    this.formaPagamento = 'DINHEIRO';
    this.showSuccessModal.set(false);
    this.ultimoIdVenda = null;
  }
}
