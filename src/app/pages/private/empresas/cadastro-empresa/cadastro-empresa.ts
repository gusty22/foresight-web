import { Component, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-empresa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [CurrencyPipe],
  templateUrl: './cadastro-empresa.html'
})
export class CadastroEmpresaComponent {
  private http = inject(HttpClient);
  private router = inject(Router);
  private currencyPipe = inject(CurrencyPipe);

  // Valor para exibição formatada no input
  valorExibicao = '';

  empresa = {
    nome: '',
    proLaboreDesejado: 0,
    tipo: 'PRODUTO'
  };

  loading = signal(false);

  // Formata o valor enquanto o usuário digita (Padrão Bancário)
  formatarMoeda(event: any) {
    let valor = event.target.value.replace(/\D/g, ''); // Remove tudo que não é número
    valor = (Number(valor) / 100).toFixed(2) + '';
    valor = valor.replace(".", ",");
    valor = valor.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
    valor = valor.replace(/(\d)(\d{3}),/g, "$1.$2,");

    this.valorExibicao = valor;
    // Converte de volta para number para o banco de dados
    this.empresa.proLaboreDesejado = Number(valor.replace(/\./g, '').replace(',', '.'));
  }

  salvarEmpresa() {
    if (!this.empresa.nome || this.empresa.proLaboreDesejado <= 0) {
      alert('Por favor, preencha todos os dados corretamente.');
      return;
    }

    this.loading.set(true);
    // Envia os dados sincronizados com o Enum do Backend
    this.http.post('http://localhost:8080/api/empresas', this.empresa)
      .subscribe({
        next: (res: any) => {
          alert('Configuração finalizada com sucesso!');
          localStorage.setItem('empresaId', res.id);
          this.router.navigate(['/sistema/dashboard']).then(() => {
            window.location.reload();
          });
        },
        error: (err) => {
          console.error(err);
          alert('Erro ao processar dados contábeis. Verifique os campos.');
          this.loading.set(false);
        }
      });
  }
}
