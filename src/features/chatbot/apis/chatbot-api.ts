import type { SendMessageRequest } from '../types'

export class ChatbotApi {
  private static readonly baseUrl = import.meta.env.VITE_CHATBOT_API_URL || ''

  /**
   * Send a message to the chatbot and get streaming response
   * @param request - Message and thread ID
   * @returns Streaming response
   */
  static async sendMessage(request: SendMessageRequest): Promise<Response> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userMessage: request.userMessage,
          threadID: request.threadID,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response
    } catch (error) {
      console.error('Error sending message to chatbot:', error)
      throw error
    }
  }

  /**
   * Generate a new thread ID for a chat session
   * @returns New thread ID
   */
  static generateThreadID(): string {
    return Date.now().toString()
  }

  /**
   * Process streaming response from chatbot
   * @param response - Fetch response object
   * @param onChunk - Callback for each chunk of data
   * @returns Promise that resolves when streaming is complete
   */
  static async processStreamingResponse(
    response: Response,
    onChunk: (chunk: string) => void
  ): Promise<string> {
    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    let fullResponse = ''

    if (!reader) {
      throw new Error('Response body is not readable')
    }

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        fullResponse += chunk
        onChunk(chunk)
      }

      return fullResponse
    } finally {
      reader.releaseLock()
    }
  }
}