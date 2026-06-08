import { api } from './axios'
import type { PresignResponse } from '@/types'

export const presign = (filename: string, contentType: string): Promise<PresignResponse> =>
  api.post<PresignResponse>('/uploads/presign', { filename, contentType }).then((r) => r.data)

export const uploadReceipt = async (file: File): Promise<string> => {
  const { uploadUrl, key } = await presign(file.name, file.type)
  await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  })
  return key
}
