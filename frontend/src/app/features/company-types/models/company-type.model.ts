export interface CompanyType {
  id: string;
  name: string;
  description?: string;
}

export interface CreateCompanyTypeRequest {
  name: string;
  description?: string;
}

export interface UpdateCompanyTypeRequest {
  name: string;
  description?: string;
}
