import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { conversationKeys } from '../hooks'
import { httpClient } from '@/libs/http/axios-instance'
import { useAllUsers, useSearchUsers } from '@/global/hooks'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Check } from 'lucide-react'
import { cn } from '@/libs/utils'

interface CreateConversationDialogProps {
  currentUserId: number
  onConversationCreated?: (conversation: any) => void
}

export function CreateConversationDialog({
  currentUserId,
  onConversationCreated,
}: CreateConversationDialogProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [openMatchedList, setOpenMatchedList] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const queryClient = useQueryClient()

  // Use Recoil user cache
  const { users: allUsers, isLoading: isLoadingUsers } = useAllUsers()
  const { users: searchResults } = useSearchUsers(searchQuery, currentUserId)

  const createConversationMutation = useMutation({
    mutationFn: async (receiverId: number) => {
      // Get user from cache
      const user = allUsers.find((u) => u.user_id === receiverId)

      if (!user) {
        throw new Error('Không tìm thấy người dùng')
      }

      console.log('Creating conversation with user:', user)
      console.log('Current user ID:', currentUserId, 'Receiver ID:', receiverId)

      // Check if conversation already exists
      let existingConversation = null
      try {
        const checkResponse = await httpClient.get(
          `/chats/conversations/between/${Number(currentUserId)}/${receiverId}`,
        )
        console.log('Check conversation response:', checkResponse.data)
        const existingData = checkResponse.data
        if (existingData?.data?.conversation || existingData?.conversation) {
          existingConversation =
            existingData?.data?.conversation || existingData?.conversation
        }
      } catch (error) {
        // Conversation doesn't exist, will create new one
      }

      if (existingConversation) {
        return {
          ...existingConversation,
          receiver_name: user?.full_name || user?.email,
          receiver_avatar: user?.avatar,
          receiver_id: receiverId,
        }
      }

      // Create new conversation
      const createPayload = {
        sender_id: Number(currentUserId),
        receiver_id: receiverId,
      }
      console.log('Creating conversation with payload:', createPayload)

      const createResponse = await httpClient.post(
        '/chats/conversations',
        createPayload,
      )

      console.log('Create conversation response:', createResponse.data)
      const conversationData = createResponse.data
      const conversation =
        conversationData?.data?.conversation || conversationData?.conversation

      return {
        ...conversation,
        receiver_name: user?.full_name || user?.email,
        receiver_avatar: user?.avatar,
        receiver_id: receiverId,
      }
    },
    onSuccess: (conversation) => {
      toast.success('Đã tạo cuộc trò chuyện mới')
      queryClient.invalidateQueries({
        queryKey: conversationKeys.list({ userId: currentUserId }),
      })
      setSearchQuery('')
      setSelectedUserId(null)
      setOpen(false)
      onConversationCreated?.(conversation)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi tạo cuộc trò chuyện')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUserId) {
      toast.error('Vui lòng chọn người dùng')
      return
    }
    createConversationMutation.mutate(selectedUserId)
  }

  const handleSelectUser = (userId: number) => {
    setSelectedUserId(userId)
    setSearchQuery('')
    setOpenMatchedList(false)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)

    if (!value.trim()) {
      setOpenMatchedList(false)
    } else {
      setOpenMatchedList(true)
    }
  }

  const selectedUser = allUsers.find((u) => u.user_id === selectedUserId)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
          <UserPlus className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tạo cuộc trò chuyện mới</DialogTitle>
          <DialogDescription>
            Nhập email của người bạn muốn trò chuyện
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Tìm kiếm người dùng</Label>
              <div className="relative">
                <Input
                  placeholder="Tìm theo tên hoặc email..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  disabled={
                    createConversationMutation.isPending || isLoadingUsers
                  }
                  onBlur={() =>
                    setTimeout(() => setOpenMatchedList(false), 200)
                  }
                  onFocus={() => searchQuery.trim() && setOpenMatchedList(true)}
                />

                {openMatchedList && (
                  <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-[300px] overflow-auto">
                    {isLoadingUsers ? (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        Đang tải danh sách người dùng...
                      </div>
                    ) : searchQuery.trim() === '' ? (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        Nhập tên hoặc email để tìm kiếm
                      </div>
                    ) : searchResults.length === 0 ? (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        Không tìm thấy người dùng
                      </div>
                    ) : (
                      <div className="py-1">
                        {searchResults.map((user) => (
                          <button
                            key={user.user_id}
                            type="button"
                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 transition-colors"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleSelectUser(user.user_id)}
                          >
                            <Avatar className="h-10 w-10 flex-shrink-0">
                              <AvatarImage
                                src={user.avatar}
                                className="rounded-full object-cover w-full h-full"
                              />
                              <AvatarFallback className="bg-blue-500 text-white font-semibold rounded-full flex items-center justify-center w-full h-full">
                                {user.full_name?.[0] || user.email[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col flex-1 min-w-0">
                              <span className="text-sm font-medium truncate">
                                {user.full_name || 'Chưa có tên'}
                              </span>
                              <span className="text-xs text-muted-foreground truncate">
                                {user.email}
                              </span>
                            </div>
                            <Check
                              className={cn(
                                'ml-auto h-4 w-4 flex-shrink-0',
                                selectedUserId === user.user_id
                                  ? 'opacity-100'
                                  : 'opacity-0',
                              )}
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {selectedUser && (
                <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={selectedUser.avatar}
                      className="rounded-full object-cover w-full h-full"
                    />
                    <AvatarFallback className="bg-blue-500 text-white font-semibold rounded-full flex items-center justify-center w-full h-full">
                      {selectedUser.full_name?.[0] || selectedUser.email[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col flex-1">
                    <span className="text-sm font-medium">
                      {selectedUser.full_name || 'Chưa có tên'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {selectedUser.email}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createConversationMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={createConversationMutation.isPending}
            >
              {createConversationMutation.isPending
                ? 'Đang tạo...'
                : 'Tạo cuộc trò chuyện'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
