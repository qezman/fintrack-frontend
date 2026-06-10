import { api } from './axios'
import type { PresignResponse } from '@/types'

export const presign = (filename: string, contentType: string): Promise<PresignResponse> =>
  api.post<PresignResponse>('/uploads/presign', { filename, contentType }).then((r) => r.data)

export const uploadReceipt = async (file: File): Promise<string> => {
  const { uploadUrl, key } = await presign(file.name, file.type)
  try {
    const res = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type },
    })
    if (!res.ok && !import.meta.env.DEV) {
      throw new Error(`Upload failed: ${res.statusText}`)
    }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn('Failed to upload receipt (likely local dev with dummy credentials):', err)
    } else {
      throw err
    }
  }
  return key
}
