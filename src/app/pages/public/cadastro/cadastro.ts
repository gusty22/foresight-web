import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cadastro.html'
})
export class CadastroComponent {
  private router = inject(Router);
  private http = inject(HttpClient);

  usuario = { nome: '', email: '', senha: '', confirmarSenha: '' };
  loading = signal(false);

  registrar() {
    if (this.usuario.senha !== this.usuario.confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    this.loading.set(true);
    this.http.post('http://localhost:8080/api/auth/registrar', this.usuario)
      .subscribe({
        next: (res: any) => {
          // Salva o token para o usuário já ficar logado
          localStorage.setItem('token', res.token);
          localStorage.setItem('usuario', res.nomeUsuario);

          alert('Conta criada! Agora, vamos configurar sua empresa.');
          // Manda direto para o cadastro de empresa dentro do sistema
          this.router.navigate(['/sistema/empresas/cadastro']);
        },
        error: (err) => {
          alert('Erro ao cadastrar: ' + (err.error?.message || 'Servidor offline'));
          this.loading.set(false);
        }
      });
  }
}
