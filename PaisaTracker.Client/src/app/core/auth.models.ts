export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  displayName?: string;
  roles: string[];
}

export interface AppUser {
  id: string;
  username: string;
  displayName?: string;
  role: string;
  createdAt: string;
}
