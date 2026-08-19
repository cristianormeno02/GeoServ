export interface ServiceType {
  id: string;
  name: string;
  description?: string;
}

export interface CreateServiceTypeRequest {
  name: string;
  description?: string;
}

export interface UpdateServiceTypeRequest {
  name: string;
  description?: string;
}
