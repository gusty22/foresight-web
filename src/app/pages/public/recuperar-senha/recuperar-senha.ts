import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-recuperar-senha',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './recuperar-senha.html',
  styles: [`
    .auth-card {
      width: 420px;
      border-radius: 1.5rem;
    }
  `]
})
export class RecuperarSenhaComponent {
  private http = inject(HttpClient);
  private router = inject(Router);

  email = '';
  loading = signal(false);
  sucesso = signal(false);

  solicitarRecuperacao() {
    this.loading.set(true);

    // Simulação de chamada ao backend
    // No futuro, conecte ao seu endpoint: this.http.post('/api/auth/recuperar', { email: this.email })
    setTimeout(() => {
      this.sucesso.set(true);
      this.loading.set(false);
    }, 1500);
  }
}
