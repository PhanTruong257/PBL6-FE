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

export interface ChatbotState {
  messages: ChatMessage[]
  currentMessage: string
  currentResponse: string
  threadID: string | null
  isProcessing: boolean
  isStarting: boolean
}

export interface SendMessageRequest {
  userMessage: string
  threadID: string
}

export interface SendMessageResponse {
  response: string
  threadID: string
  success: boolean
  error?: string
}