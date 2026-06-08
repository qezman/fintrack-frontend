export interface PresignPayload {
  filename: string
  contentType: string
}

export interface PresignResponse {
  uploadUrl: string
  key: string
}
