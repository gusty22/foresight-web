export interface LoginResponse {
  token: string;
  nome: string;
}

export interface UsuarioLogado {
  id: number;
  nome: string;
  email: string;
}
