import { httpClient } from '@/libs/http'

export interface UploadChatFileResponse {
  file_url: string
  file_name: string
  file_size: number
  mime_type: string
}

export const uploadChatFile = async (
  file: File,
): Promise<UploadChatFileResponse> => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await httpClient.post('/chats/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data.data || response.data
}

export const downloadChatFile = async (filename: string): Promise<Blob> => {
  // Extract filename from file_url if it's a full path
  const actualFilename = filename.includes('/')
    ? filename.split('/').pop()
    : filename

  const response = await httpClient.get(`/chats/download/${actualFilename}`, {
    responseType: 'blob',
  })

  return response.data
}
