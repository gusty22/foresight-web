import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth-guard';

// Importação estática APENAS para os Layouts Pai
import { PublicLayoutComponent } from './layout/public/public-layout';
import { PrivateLayoutComponent } from './layout/private/private-layout';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // ==========================================
  // ROTAS PÚBLICAS (Onboarding & Auth)
  // ==========================================
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/pages/login').then(m => m.LoginComponent)
      },
      {
        path: 'cadastro',
        loadComponent: () => import('./features/auth/cadastro/pages/cadastro').then(m => m.CadastroComponent)
      },
      {
        path: 'recuperar-senha',
        loadComponent: () => import('./features/auth/recuperar-senha/pages/recuperar-senha').then(m => m.RecuperarSenhaComponent)
      }
    ]
  },

  // ==========================================
  // ROTAS PRIVADAS (Sistema Core SaaS)
  // ==========================================
  {
    path: 'sistema',
    component: PrivateLayoutComponent,
    canActivate: [authGuard], // Blindagem total: nenhuma rota filha carrega sem token válido
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/pages/dashboard').then(m => m.DashboardComponent)
      },

      // --- Operacional ---
      {
        path: 'vendas',
        loadComponent: () => import('./features/vendas/pages/vendas').then(m => m.VendasComponent)
      },
      {
        path: 'vendas/historico',
        loadComponent: () => import('./features/vendas/pages/historico-vendas/historico-vendas').then(m => m.HistoricoVendasComponent)
      },
      {
        path: 'clientes',
        loadComponent: () => import('./features/clientes/pages/clientes').then(m => m.ClientesComponent)
      },

      // --- Gestão ---
      {
        path: 'estoque',
        loadComponent: () => import('./features/produtos/pages/produtos').then(m => m.ProdutosComponent)
      },
      {
        path: 'produtos', // Alias para manter atalhos antigos funcionando
        redirectTo: 'estoque', pathMatch: 'full'
      },
      {
        path: 'produtos/analise',
        loadComponent: () => import('./features/produtos/pages/analise/lucratividade').then(m => m.LucratividadeComponent)
      },

      // --- Financeiro ---
      {
        path: 'fluxo-caixa',
        loadComponent: () => import('./features/financeiro/pages/fluxo-caixa/fluxo-caixa').then(m => m.FluxoCaixaComponent)
      },
      {
        path: 'despesas',
        loadComponent: () => import('./features/financeiro/pages/despesas/despesas').then(m => m.DespesasComponent)
      },

      // --- Relatórios ---
      {
        path: 'relatorios/dre',
        loadComponent: () => import('./features/relatorios/dre/pages/dre').then(m => m.DreComponent)
      },
      {
        path: 'relatorios/avancado',
        loadComponent: () => import('./features/relatorios/avancado/pages/relatorio-geral/relatorio-geral').then(m => m.RelatorioGeralComponent)
      },

      // --- Sistema e Segurança ---
      {
        path: 'auditoria',
        loadComponent: () => import('./features/auditoria/pages/auditoria').then(m => m.AuditoriaComponent)
      },
      {
        path: 'configuracoes',
        loadComponent: () => import('./features/configuracoes/pages/configuracoes').then(m => m.ConfiguracoesComponent)
      },

      // Fallback interno: Se o usuário digitar algo errado dentro de /sistema, cai no Dashboard
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: '**', redirectTo: 'dashboard' }
    ]
  },

  // Fallback Global de Segurança
  { path: '**', redirectTo: 'login' }
];
