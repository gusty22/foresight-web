import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracoes.html',
  styleUrl: './configuracoes.scss'
})
export class ConfiguracoesComponent implements OnInit {
  private http = inject(HttpClient);

  // Controle de Abas
  abaAtiva = signal<'perfil' | 'empresa' | 'seguranca'>('perfil');
  loading = signal(false);

  // Dados do Formulário
  usuario = {
    nome: '',
    email: '',
    telefone: ''
  };

  empresa = {
    nome: '',
    cnpj: '',
    prolabore: 0,
    natureza: 'PRODUTO' // ou SERVICO
  };

  senha = {
    atual: '',
    nova: '',
    confirmacao: ''
  };

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    // Aqui você conectaria com seu authService ou endpoint de perfil
    // Simulando dados para o layout:
    this.usuario = { nome: 'Gustavo Admin', email: 'gustavo@empresa.com', telefone: '(34) 99999-9999' };
    this.empresa = { nome: 'Foresight Tech', cnpj: '12.345.678/0001-90', prolabore: 5000, natureza: 'SERVICO' };
  }

  mudarAba(aba: 'perfil' | 'empresa' | 'seguranca') {
    this.abaAtiva.set(aba);
  }

  salvarPerfil() {
    this.loading.set(true);
    // Simulação de delay
    setTimeout(() => {
      this.loading.set(false);
      alert('Perfil atualizado com sucesso!');
    }, 1000);
  }

  salvarEmpresa() {
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
      alert('Dados da empresa atualizados!');
    }, 1000);
  }

  alterarSenha() {
    if (this.senha.nova !== this.senha.confirmacao) {
      alert('A nova senha e a confirmação não conferem.');
      return;
    }
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
      alert('Senha alterada com sucesso. Faça login novamente.');
      // Lógica de logout aqui se necessário
    }, 1000);
  }
}
