export type TransactionType = 'entrada' | 'saida';
export type TransactionStatus = 'pendente' | 'pago' | 'historico';

export interface ApiUser {
  id: string;
  email: string;
  name: string;
  saldo_atual: number;
  salario_mensal: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiTransaction {
  id: string;
  userId: string;
  descricao: string;
  valorOriginal: number;
  valorFinal: number;
  dataVencimento: string;
  categoria: string;
  tipo: TransactionType;
  status: TransactionStatus;
  saldoMutation: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiListTransactionsResponse {
  data: ApiTransaction[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateTransactionPayload {
  descricao: string;
  valorOriginal: number;
  valorFinal: number;
  dataVencimento: string;
  categoria: string;
  tipo: TransactionType;
  status: TransactionStatus;
  saldoMutation: number;
}

export interface ProcessFinancialInputResponse {
  transactions: CreateTransactionPayload[];
}

export interface ApiAuthResponse {
  accessToken: string;
  user: ApiUser;
}

const DEFAULT_API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://ltfinancials-flow-api.vercel.app'
    : 'http://localhost:3001';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_BASE_URL;

function normalizeBaseUrl(url: string) {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

function buildHeaders(token?: string, headers?: HeadersInit): HeadersInit {
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    'Content-Type': 'application/json',
    ...headers,
  };
}

type ApiRequestInit = RequestInit & { token?: string };

async function apiRequest<T>(path: string, init?: ApiRequestInit): Promise<T> {
  const { token, ...requestInit } = init ?? {};
  const response = await fetch(`${normalizeBaseUrl(API_BASE_URL)}${path}`, {
    ...requestInit,
    headers: buildHeaders(token, requestInit.headers),
  });

  if (!response.ok) {
    let message = `API request failed (${response.status})`;
    try {
      const errorData = await response.json();
      if (typeof errorData?.message === 'string') {
        message = errorData.message;
      }
    } catch {
      // Ignore JSON parsing errors and keep generic message.
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function getCurrentUser(token: string) {
  return apiRequest<ApiUser>('/users/me', { token });
}

export function listTransactions(token: string) {
  return apiRequest<ApiListTransactionsResponse>('/transactions?page=1&limit=100', { token });
}

export function createTransaction(token: string, payload: CreateTransactionPayload) {
  return apiRequest<ApiTransaction>('/transactions', {
    token,
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function processFinancialInput(token: string, input: string) {
  return apiRequest<ProcessFinancialInputResponse>('/ai/process-financial-input', {
    token,
    method: 'POST',
    body: JSON.stringify({ input }),
  });
}

export function login(email: string, password: string) {
  return apiRequest<ApiAuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function register(name: string, email: string, password: string) {
  return apiRequest<ApiAuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}
