export interface ChatMessage {
  id?: string
  content: string
  role: 'user' | 'ai'
  timestamp?: Date
}

export interface ChatSession {
  threadID: string
  messages: ChatMessage[]
  createdAt: Date
  lastActiveAt: Date
}

export interface UploadedFile {
  file: File
  id: string
  name: string
  size: number
  type: string
}

export interface ChatbotState {
  messages: ChatMessage[]
  currentMessage: string
  currentResponse: string
  threadID: string | null
  isProcessing: boolean
  isStarting: boolean
  uploadedFiles: UploadedFile[]
}

export interface SendMessageRequest {
  userMessage: string
  threadID: string
  files?: File[]
  user_id: number
  user_role: string
}

export interface SendMessageResponse {
  response: string
  threadID: string
  success: boolean
  error?: string
}