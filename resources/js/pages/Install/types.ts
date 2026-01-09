export interface Requirement {
  name: string;
  status: 'pending' | 'success' | 'error';
  message?: string;
}

export interface DatabaseConfig {
  connection: 'sqlite' | 'mysql' | 'pgsql';
  host?: string;
  port?: number;
  database: string;
  username: string;
  password: string;
}

export interface AdminConfig {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface InstallState {
  requirements: Requirement[];
  database: DatabaseConfig;
  admin: AdminConfig;
  currentStep: number;
}
