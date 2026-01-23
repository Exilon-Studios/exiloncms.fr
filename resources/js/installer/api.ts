// Installer API

import type { SystemInfo } from './types';

const installerConfig = (window as any).EXILONCMS_INSTALLER as {
  apiUrl: string;
  version: string;
  minPhpVersion: string;
};

export async function fetchInstallerInfo(): Promise<SystemInfo> {
  const response = await fetch(installerConfig.apiUrl + '?execute=php', {
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch installer info');
  }

  return response.json();
}

export async function downloadCms(): Promise<SystemInfo> {
  const response = await fetch(installerConfig.apiUrl + '?action=download', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to download CMS');
  }

  return response.json();
}

export async function extractCms(): Promise<SystemInfo> {
  const response = await fetch(installerConfig.apiUrl + '?action=extract', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to extract CMS');
  }

  return response.json();
}

export async function finalizeInstall(version: string): Promise<SystemInfo> {
  const response = await fetch(installerConfig.apiUrl + '?action=install&version=' + encodeURIComponent(version), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to finalize installation');
  }

  return response.json();
}
