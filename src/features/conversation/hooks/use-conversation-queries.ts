import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ConversationService } from '../api'
import type {
  CreateConversationRequest,
  SendMessageRequest,
  GetMessagesRequest,
} from '../types'

/**
 * Centralized query keys for conversation feature
 */
export const conversationKeys = {
  all: ['conversations'] as const,
  lists: () => [...conversationKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...conversationKeys.lists(), { filters }] as const,
  details: () => [...conversationKeys.all, 'detail'] as const,
  detail: (id: number) => [...conversationKeys.details(), id] as const,
  messages: (conversationId: number) =>
    [...conversationKeys.all, 'messages', conversationId] as const,
  unread: {
    all: () => ['unread'] as const,
    total: (userId: number) =>
      [...conversationKeys.unread.all(), 'total', userId] as const,
    byConversation: (userId: number) =>
      [...conversationKeys.unread.all(), 'by-conversation', userId] as const,
    conversationsCount: (userId: number) =>
      [
        ...conversationKeys.unread.all(),
        'conversations-count',
        userId,
      ] as const,
  },
}

/**
 * Hook to get conversations list
 */
export function useConversations(params: {
  userId: number
  page?: number
  limit?: number
}) {
  return useQuery({
    queryKey: conversationKeys.list(params),
    queryFn: () => ConversationService.getConversations(params),
    enabled: !!params.userId,
    staleTime: 30000,
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
    staleTime: 60000,
  })
}

/**
 * Hook to get messages for a conversation with real-time merge
 */
export function useMessages(params: GetMessagesRequest, enabled = true) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: conversationKeys.messages(params.conversation_id),
    queryFn: async () => {
      const currentCache = queryClient.getQueryData<any>(
        conversationKeys.messages(params.conversation_id),
      )
      const apiData = await ConversationService.getMessages(params)
      const apiMessages = apiData?.data?.messages || apiData?.messages || []
      const cachedMessages =
        currentCache?.data?.messages || currentCache?.messages || []

      // Merge real-time messages not yet in API
      const mergedMessages = [...apiMessages]
      cachedMessages.forEach((cachedMsg: any) => {
        const existsInAPI = apiMessages.some(
          (apiMsg: any) =>
            apiMsg.id === cachedMsg.id ||
            (cachedMsg.client_id && apiMsg.client_id === cachedMsg.client_id),
        )
        if (!existsInAPI) {
          mergedMessages.push(cachedMsg)
        }
      })

      mergedMessages.sort((a: any, b: any) => {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      })

      if (apiData?.data?.messages) {
        return {
          ...apiData,
          data: { ...apiData.data, messages: mergedMessages },
        }
      } else if (apiData?.messages) {
        return { ...apiData, messages: mergedMessages }
      }
      return { messages: mergedMessages }
    },
    enabled: enabled && !!params.conversation_id,
    staleTime: 10000,
  })
}

/**
 * Mutations
 */
export function useCreateConversation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateConversationRequest) =>
      ConversationService.createConversation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() })
    },
  })
}

export function useSendMessage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: SendMessageRequest) =>
      ConversationService.sendMessage(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: conversationKeys.messages(variables.conversation_id),
      })
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() })
    },
  })
}

export function useDeleteConversation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => ConversationService.deleteConversation(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: conversationKeys.detail(id) })
      queryClient.removeQueries({ queryKey: conversationKeys.messages(id) })
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() })
    },
  })
}

export function useDeleteMessage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => ConversationService.deleteMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.all })
    },
  })
}

export function useMarkAsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (conversationId: number) =>
      ConversationService.markAsRead(conversationId),
    onSuccess: (_, conversationId) => {
      queryClient.invalidateQueries({
        queryKey: conversationKeys.detail(conversationId),
      })
      queryClient.invalidateQueries({
        queryKey: conversationKeys.messages(conversationId),
      })
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() })
    },
  })
}
