export const BASE_URL = 'http://localhost:3000';
export const API_URL = `${BASE_URL}/api`;

export function resolverImagen(url: string | null | undefined): string | null {
  if (!url) {
    return null;
  }
  return url.startsWith('/uploads') ? BASE_URL + url : url;
}