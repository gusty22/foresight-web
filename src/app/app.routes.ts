import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { configGuard } from './core/guards/config-guard';

// Layouts
import { PublicLayoutComponent } from './layout/public-layout/public-layout';
import { PrivateLayoutComponent } from './layout/private-layout/private-layout';

// Páginas Públicas
import { LoginComponent } from './pages/public/login/login';
import { CadastroComponent } from './pages/public/cadastro/cadastro';
import { RecuperarSenhaComponent } from './pages/public/recuperar-senha/recuperar-senha';

// Páginas Privadas
import { DashboardComponent } from './pages/private/dashboard/dashboard';
import { VendasComponent } from './pages/private/vendas/vendas';
import { HistoricoVendasComponent } from './pages/private/vendas/historico-vendas/historico-vendas';
import { ProdutosComponent } from './pages/private/produtos/produtos'; // Estoque
import { ClientesComponent } from './pages/private/clientes/clientes'; // Novo
import { FluxoCaixaComponent } from './pages/private/fluxo-caixa/fluxo-caixa'; // Novo
import { ConfiguracoesComponent } from './pages/private/configuracoes/configuracoes'; // Novo
import { DespesasComponent } from './pages/private/despesas/despesas';
import { DreComponent } from './pages/private/relatorios/dre/dre';
import { AuditoriaComponent } from './pages/private/auditoria/auditoria';
import { LucratividadeComponent } from './pages/private/produtos/analise/lucratividade';
import { CadastroEmpresaComponent } from './pages/private/empresas/cadastro-empresa/cadastro-empresa';
import { EmpresasComponent } from './pages/private/empresas/empresas';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Rotas Públicas
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'cadastro', component: CadastroComponent },
      { path: 'recuperar-senha', component: RecuperarSenhaComponent }
    ]
  },

  // Rotas Privadas (Sistema)
  {
    path: 'sistema',
    component: PrivateLayoutComponent,
    canActivate: [authGuard],
    children: [
      // Onboarding (Primeiro acesso)
      { path: 'empresas/cadastro', component: CadastroEmpresaComponent },

      // Core (Protegido por ConfigGuard - exige empresa ativa)
      {
        path: '',
        canActivate: [configGuard],
        children: [
          { path: 'dashboard', component: DashboardComponent },

          // Operacional
          { path: 'vendas', component: VendasComponent },
          { path: 'vendas/historico', component: HistoricoVendasComponent },
          { path: 'clientes', component: ClientesComponent }, // Rota Corrigida

          // Gestão
          { path: 'estoque', component: ProdutosComponent }, // Mapeado para Produtos
          { path: 'produtos', redirectTo: 'estoque', pathMatch: 'full' }, // Redireciona antigo para novo
          { path: 'produtos/analise', component: LucratividadeComponent },

          // Financeiro
          { path: 'fluxo-caixa', component: FluxoCaixaComponent }, // Rota Corrigida
          { path: 'despesas', component: DespesasComponent },
          { path: 'relatorios/dre', component: DreComponent },

          // Sistema
          { path: 'auditoria', component: AuditoriaComponent },
          { path: 'configuracoes', component: ConfiguracoesComponent }, // Rota Corrigida
          { path: 'empresas', component: EmpresasComponent }, // Minha Empresa

          // Default do sistema
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
      }
    ]
  },

  // Fallback (Erro 404 volta para login)
  { path: '**', redirectTo: 'login' }
];
