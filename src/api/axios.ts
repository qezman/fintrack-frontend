import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL

export const publicApi: AxiosInstance = axios.create({ baseURL: BASE_URL })

export const api: AxiosInstance = axios.create({ baseURL: BASE_URL })

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('fintrack_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  }
)

api.interceptors.response.use(
  (res) => res,
  (err: unknown) => {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      localStorage.removeItem('fintrack_token')
      localStorage.removeItem('fintrack_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)
