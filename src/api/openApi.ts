import {request} from './client';
export const openApi = { request<T>(path:string, options?:RequestInit){ const base=import.meta.env.VITE_OPEN_API_URL || ''; return request<T>(`${base}${path}`,options); } };
