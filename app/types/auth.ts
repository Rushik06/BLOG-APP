export interface AuthUser {
  id: number;
  username: string;
  email: string;
}

export interface LoginResponse {
  jwt: string;
  user: AuthUser;
}