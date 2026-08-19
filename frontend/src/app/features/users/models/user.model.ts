export interface Role {
  id: string;
  name: string;
  description?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
  roleName?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password?: string;
  roleId: string;
  isActive: boolean;
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  password?: string;
  roleId: string;
  isActive: boolean;
}
