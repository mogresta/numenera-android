export interface User {
  id: number;
  username: string;
  email: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface UpdateUsernameResponse {
  message: string;
  token: string;
  user: User;
}