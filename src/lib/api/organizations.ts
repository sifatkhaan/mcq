import { authenticatedApiClient } from "./authenticated-client";

export interface Organization {
  id: number;
  name: string;
  code?: string | null;
  description?: string | null;
  status?: string;
}

export async function getOrganizations() {
  return authenticatedApiClient<Organization[]>("/organizations");
}
export interface OrganizationStudent {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export async function getOrganizationStudents(organizationId: number) {
  return authenticatedApiClient<OrganizationStudent[]>(
    `/organizations/${organizationId}/students`,
  );
}
