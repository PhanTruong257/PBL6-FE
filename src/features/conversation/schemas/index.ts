import { z } from 'zod'
import { MessageType } from '../types'

export const createConversationSchema = z.object({
    receiver_id: z.number().min(1, 'Receiver ID là bắt buộc'),
})

export const sendMessageSchema = z.object({
    conversation_id: z.number().min(1, 'Conversation ID là bắt buộc'),
    message_type: z.nativeEnum(MessageType).default(MessageType.text),
    content: z.string().min(1, 'Nội dung tin nhắn là bắt buộc').max(1000, 'Tin nhắn không được quá 1000 ký tự'),
})

export const getMessagesSchema = z.object({
    conversation_id: z.number().min(1, 'Conversation ID là bắt buộc'),
    page: z.number().min(1).default(1).optional(),
    limit: z.number().min(1).max(100).default(20).optional(),
})

export type CreateConversationForm = z.infer<typeof createConversationSchema>
export type SendMessageForm = z.infer<typeof sendMessageSchema>
export type GetMessagesForm = z.infer<typeof getMessagesSchema>