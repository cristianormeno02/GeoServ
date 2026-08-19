export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface UpdateProjectRequest {
  name: string;
  description?: string;
}
