export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "EXAMINER"
  | "TEACHER"
  | "STUDENT";

export interface User {
  id: number;
  email: string;
  name?: string;
  roles?: UserRole[];
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}
