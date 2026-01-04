/**
 * Auth Types - Authentication related types
 */

export interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  conditions?: boolean;
}

export interface LoginProps {
  captcha: boolean;
  canRegister: boolean;
}

export interface RegisterProps {
  captcha: boolean;
  registerConditions?: string;
}
