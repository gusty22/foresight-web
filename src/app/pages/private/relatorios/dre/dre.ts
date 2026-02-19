import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dre',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dre.html'
})
export class DreComponent implements OnInit {
  private http = inject(HttpClient);

  dre = signal<any>(null);
  loading = signal(true);

  ngOnInit() {
    this.carregarDre();
  }

  carregarDre() {
    const empresaId = 1;
    this.http.get<any>(`http://localhost:8080/api/relatorios/dre/${empresaId}`)
      .subscribe({
        next: (res) => {
          this.dre.set(res);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }
}
