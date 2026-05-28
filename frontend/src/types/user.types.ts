export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'STUDENT'; // Ajusta los roles según tu backend
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
