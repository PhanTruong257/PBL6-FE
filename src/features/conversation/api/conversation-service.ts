import { httpClient } from '@/libs/http'
import type {
    Conversation,
    CreateConversationRequest,
    SendMessageRequest,
    GetConversationsResponse,
    GetMessagesRequest,
    GetMessagesResponse,
    ConversationWithUser,
    MessageWithSender,
} from '../types'

const CONVERSATION_ENDPOINTS = {
    conversations: '/conversations',
    messages: '/messages',
    conversation: (id: number) => `/conversations/${id}`,
    conversationMessages: (id: number) => `/conversations/${id}/messages`,
} as const

export class ConversationService {
    /**
     * Get all conversations for current user
     */
    static async getConversations(params?: {
        page?: number
        limit?: number
    }): Promise<GetConversationsResponse> {
        const response = await httpClient.get(CONVERSATION_ENDPOINTS.conversations, {
            params,
        })
        return response.data
    }

    /**
     * Get conversation by ID
     */
    static async getConversation(id: number): Promise<{ data: ConversationWithUser }> {
        const response = await httpClient.get(CONVERSATION_ENDPOINTS.conversation(id))
        return response.data
    }

    /**
     * Create new conversation
     */
    static async createConversation(
        data: CreateConversationRequest
    ): Promise<{ data: Conversation }> {
        const response = await httpClient.post(CONVERSATION_ENDPOINTS.conversations, data)
        return response.data
    }

    /**
     * Delete conversation
     */
    static async deleteConversation(id: number): Promise<{ message: string }> {
        const response = await httpClient.delete(CONVERSATION_ENDPOINTS.conversation(id))
        return response.data
    }

    /**
     * Get messages for a conversation
     */
    static async getMessages(params: GetMessagesRequest): Promise<GetMessagesResponse> {
        const { conversation_id, ...queryParams } = params
        const response = await httpClient.get(
            CONVERSATION_ENDPOINTS.conversationMessages(conversation_id),
            {
                params: queryParams,
            }
        )
        return response.data
    }

    /**
     * Send message
     */
    static async sendMessage(data: SendMessageRequest): Promise<{ data: MessageWithSender }> {
        const response = await httpClient.post(CONVERSATION_ENDPOINTS.messages, data)
        return response.data
    }

    /**
     * Delete message
     */
    static async deleteMessage(id: number): Promise<{ message: string }> {
        const response = await httpClient.delete(`${CONVERSATION_ENDPOINTS.messages}/${id}`)
        return response.data
    }

    /**
     * Mark messages as read
     */
    static async markAsRead(conversationId: number): Promise<{ message: string }> {
        const response = await httpClient.put(
            `${CONVERSATION_ENDPOINTS.conversation(conversationId)}/read`
        )
        return response.data
    }
}