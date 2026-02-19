import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private http = inject(HttpClient);

  // Dados de login sincronizados com o DTO do seu Backend Java
  loginData = { email: '', senha: '' };

  handleLogin(event: Event) {
    event.preventDefault();

    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        console.log('Login bem-sucedido! Verificando empresa...', res);

        // Regra de Negócio: Busca se o usuário já tem uma empresa vinculada
        this.http.get<any[]>('http://localhost:8080/api/empresas').subscribe({
          next: (empresas) => {
            if (empresas && empresas.length > 0) {
              // Se já tem empresa, salva o ID da primeira e vai para o Dashboard
              localStorage.setItem('empresaId', empresas[0].id.toString());
              this.router.navigate(['/sistema/dashboard']);
            } else {
              // Fluxo de Boas-Vindas: Se não tem empresa, força o cadastro
              console.log('Nenhuma empresa encontrada para este usuário. Redirecionando para cadastro...');
              this.router.navigate(['/sistema/empresas/cadastro']);
            }
          },
          error: (err) => {
            console.error('Erro ao verificar empresas:', err);
            // Em caso de erro na busca, envia para o cadastro por segurança
            this.router.navigate(['/sistema/empresas/cadastro']);
          }
        });
      },
      error: (err) => {
        console.error('Erro no login:', err);
        alert('Falha ao entrar. Verifique seu e-mail e senha.');
      }
    });
  }
}
