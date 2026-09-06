export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  latitud?: number;
  longitud?: number;
  hasActiveOrders?: boolean;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  latitud?: number;
  longitud?: number;
}

export interface UpdateProjectRequest {
  name: string;
  description?: string;
  latitud?: number;
  longitud?: number;
}
