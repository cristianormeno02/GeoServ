export interface CompanyType {
  id: string;
  name: string;
}

export interface AvailableUser {
  id: string;
  name: string;
  email: string;
}

export interface Client {
  id: string;
  companyName: string;
  taxId: string;
  companyTypeId?: string;
  companyTypeName?: string;
  contactEmail: string;
  contactPhone: string;
  userId?: string;
  userDisplay?: string;
}

export interface CreateClientRequest {
  companyName: string;
  taxId: string;
  companyTypeId?: string;
  contactEmail: string;
  contactPhone: string;
  userId?: string;
}

export interface UpdateClientRequest {
  companyName: string;
  taxId: string;
  companyTypeId?: string;
  contactEmail: string;
  contactPhone: string;
  userId?: string;
}
