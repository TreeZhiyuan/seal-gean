export interface OpenApiClient { request<T>(path:string, options?:RequestInit):Promise<T>; }
