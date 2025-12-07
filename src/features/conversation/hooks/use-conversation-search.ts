import { useState, useCallback } from 'react'
import type { ConversationWithUser } from '../types'

interface UseConversationSearchOptions {
  conversations: any[]
  onSelectConversation: (conversation: ConversationWithUser) => void
}

/**
 * Hook to handle conversation search functionality
 */
export function useConversationSearch({
  conversations,
  onSelectConversation,
}: UseConversationSearchOptions) {
  const [searchQuery, setSearchQuery] = useState('')
  const [openUserSearch, setOpenUserSearch] = useState(false)

  const filteredConversations = conversations.filter((conv: any) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    const receiverName = conv.receiver_name?.toLowerCase() || ''
    const receiverEmail = conv.receiver_email?.toLowerCase() || ''
    return receiverName.includes(query) || receiverEmail.includes(query)
  })

  const handleSelectUserFromSearch = useCallback(
    (userId: number) => {
      const existingConv = conversations.find(
        (conv: any) => conv.receiver_id === userId,
      )

      if (existingConv) {
        onSelectConversation(existingConv)
      }

      setSearchQuery('')
      setOpenUserSearch(false)
    },
    [conversations, onSelectConversation],
  )

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setSearchQuery(value)

      if (!value.trim()) {
        setOpenUserSearch(false)
      } else {
        setOpenUserSearch(true)
      }
    },
    [],
  )

  const clearSearch = useCallback(() => {
    setSearchQuery('')
    setOpenUserSearch(false)
  }, [])

  return {
    searchQuery,
    openUserSearch,
    filteredConversations,
    setOpenUserSearch,
    handleSelectUserFromSearch,
    handleSearchChange,
    clearSearch,
  }
}
