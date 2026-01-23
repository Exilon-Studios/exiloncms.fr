// Installer Types

export interface InstallerConfig {
  apiUrl: string;
  version: string;
  minPhpVersion: string;
}

export interface SystemInfo {
  installerVersion: string;
  minPhpVersion: string;
  phpVersion: string;
  phpFullVersion: string;
  phpIniPath: string;
  path: string;
  installerPath: string;
  windows: boolean;
  installed: boolean;
  compatible: boolean;
  downloaded: boolean;
  extracted: boolean;
  downloading?: boolean;
  version?: string;
  tagName?: string;
  releaseName?: string;
  releaseNotes?: string;
  requirements: Record<string, boolean>;
}

export type Step = 'welcome' | 'requirements' | 'download' | 'database' | 'mode' | 'admin' | 'complete';

export interface DatabaseConfig {
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
}

export interface AdminConfig {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export type InstallMode = 'production' | 'demo';
