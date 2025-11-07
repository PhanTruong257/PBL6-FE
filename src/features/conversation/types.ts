export enum MessageType {
    text = 'text',
    file = 'file',
    image = 'image',
}

export interface Conversation {
    id: number
    sender_id: number
    receiver_id: number
    messages?: Message[]
    created_at?: string
    updated_at?: string
}

export interface Message {
    id: number
    sender_id: number
    conversation_id: number
    timestamp: string
    message_type: MessageType
    content?: string
    conversation?: Conversation
}

// API Request/Response types
export interface CreateConversationRequest {
    receiver_id: number
}

export interface SendMessageRequest {
    sender_id: number
    conversation_id: number
    message_type?: MessageType
    content: string
}

export interface GetConversationsResponse {
    success?: boolean
    message?: string
    data?: {
        success: boolean
        conversations: ConversationWithUser[]
        total: number
        page: number
        limit: number
        totalPages: number
    }
    // Alternative flat structure
    conversations?: ConversationWithUser[]
    total?: number
    page?: number
    limit?: number
}

export interface GetMessagesRequest {
    conversation_id: number
    page?: number
    limit?: number
}

export interface GetMessagesResponse {
    success?: boolean
    message?: string
    data?: {
        success: boolean
        messages: Message[]
        total: number
        page: number
        limit: number
        totalPages: number
    }
    // Alternative flat structure
    messages?: Message[]
    total?: number
    page?: number
    limit?: number
}

// Extended types with user info
export interface ConversationWithUser extends Conversation {
    receiver_name?: string
    receiver_avatar?: string
    last_message?: Message
    unread_count?: number
}

export interface MessageWithSender extends Message {
    sender_name?: string
    sender_avatar?: string
}