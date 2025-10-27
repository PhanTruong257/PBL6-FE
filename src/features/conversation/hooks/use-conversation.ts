import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ConversationService } from '../api'
import type {
    CreateConversationRequest,
    SendMessageRequest,
    GetMessagesRequest,
} from '../types'

// Query keys
export const conversationKeys = {
    all: ['conversations'] as const,
    lists: () => [...conversationKeys.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...conversationKeys.lists(), { filters }] as const,
    details: () => [...conversationKeys.all, 'detail'] as const,
    detail: (id: number) => [...conversationKeys.details(), id] as const,
    messages: (conversationId: number) => [...conversationKeys.all, 'messages', conversationId] as const,
}

/**
 * Hook to get conversations list
 */
export function useConversations(params?: { page?: number; limit?: number }) {
    return useQuery({
        queryKey: conversationKeys.list(params || {}),
        queryFn: () => ConversationService.getConversations(params),
        staleTime: 30000, // 30 seconds
    })
}

/**
 * Hook to get conversation detail
 */
export function useConversation(id: number, enabled = true) {
    return useQuery({
        queryKey: conversationKeys.detail(id),
        queryFn: () => ConversationService.getConversation(id),
        enabled: enabled && !!id,
        staleTime: 60000, // 1 minute
    })
}

/**
 * Hook to get messages for a conversation
 */
export function useMessages(params: GetMessagesRequest, enabled = true) {
    return useQuery({
        queryKey: conversationKeys.messages(params.conversation_id),
        queryFn: () => ConversationService.getMessages(params),
        enabled: enabled && !!params.conversation_id,
        staleTime: 10000, // 10 seconds
    })
}

/**
 * Hook to create conversation
 */
export function useCreateConversation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateConversationRequest) =>
            ConversationService.createConversation(data),
        onSuccess: () => {
            // Invalidate conversations list
            queryClient.invalidateQueries({ queryKey: conversationKeys.lists() })
        },
    })
}

/**
 * Hook to send message
 */
export function useSendMessage() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: SendMessageRequest) => ConversationService.sendMessage(data),
        onSuccess: (_, variables) => {
            // Invalidate messages for this conversation
            queryClient.invalidateQueries({
                queryKey: conversationKeys.messages(variables.conversation_id),
            })
            // Invalidate conversations list to update last message
            queryClient.invalidateQueries({ queryKey: conversationKeys.lists() })
        },
    })
}

/**
 * Hook to delete conversation
 */
export function useDeleteConversation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => ConversationService.deleteConversation(id),
        onSuccess: (_, id) => {
            // Remove from cache
            queryClient.removeQueries({ queryKey: conversationKeys.detail(id) })
            queryClient.removeQueries({ queryKey: conversationKeys.messages(id) })
            // Invalidate conversations list
            queryClient.invalidateQueries({ queryKey: conversationKeys.lists() })
        },
    })
}

/**
 * Hook to delete message
 */
export function useDeleteMessage() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => ConversationService.deleteMessage(id),
        onSuccess: () => {
            // Invalidate all messages queries
            queryClient.invalidateQueries({ queryKey: conversationKeys.all })
        },
    })
}

/**
 * Hook to mark messages as read
 */
export function useMarkAsRead() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (conversationId: number) => ConversationService.markAsRead(conversationId),
        onSuccess: (_, conversationId) => {
            // Invalidate conversation and messages
            queryClient.invalidateQueries({ queryKey: conversationKeys.detail(conversationId) })
            queryClient.invalidateQueries({ queryKey: conversationKeys.messages(conversationId) })
            queryClient.invalidateQueries({ queryKey: conversationKeys.lists() })
        },
    })
}