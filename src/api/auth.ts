import { publicApi } from './axios'
import type { AuthResponse, LoginPayload, RegisterPayload } from '@/types'

export const login = (payload: LoginPayload): Promise<AuthResponse> =>
  publicApi.post<AuthResponse>('/auth/login', payload).then((r) => r.data)

export const register = (payload: RegisterPayload): Promise<AuthResponse> =>
  publicApi.post<AuthResponse>('/auth/register', payload).then((r) => r.data)
