import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { conversationKeys } from '../hooks'
import { httpClient } from '@/libs/http/axios-instance'

interface CreateConversationDialogProps {
    currentUserId: number
    onConversationCreated?: (conversation: any) => void
}

export function CreateConversationDialog({
    currentUserId,
    onConversationCreated
}: CreateConversationDialogProps) {
    const [open, setOpen] = useState(false)
    const [email, setEmail] = useState('')
    const queryClient = useQueryClient()

    const createConversationMutation = useMutation({
        mutationFn: async (receiverEmail: string) => {
            // First, get user by email
            const userResponse = await httpClient.get(`/users/get-profile-by-email`, {
                params: { email: receiverEmail }
            })

            console.log('User response from API:', userResponse.data)
            const responseData = userResponse.data
            // Backend returns { success, message, data: { user: {...} } }
            const user = responseData.data?.user || responseData.user
            const receiverId = Number(user?.user_id)

            console.log('Extracted user:', user)
            console.log('Extracted receiverId:', receiverId, 'Type:', typeof receiverId)

            if (!receiverId || isNaN(receiverId)) {
                throw new Error('Không thể lấy thông tin người dùng')
            }

            if (receiverId === currentUserId) {
                throw new Error('Không thể tạo cuộc trò chuyện với chính mình')
            }

            console.log('Current user ID:', currentUserId, 'Type:', typeof currentUserId)

            // Check if conversation already exists
            let existingConversation = null
            try {
                const checkResponse = await httpClient.get(
                    `/chats/conversations/between/${Number(currentUserId)}/${receiverId}`
                )
                console.log('Check conversation response:', checkResponse.data)
                const existingData = checkResponse.data
                if (existingData?.data?.conversation || existingData?.conversation) {
                    existingConversation = existingData?.data?.conversation || existingData?.conversation
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
            
            const createResponse = await httpClient.post('/chats/conversations', createPayload)

            console.log('Create conversation response:', createResponse.data)
            const conversationData = createResponse.data
            const conversation = conversationData?.data?.conversation || conversationData?.conversation

            return {
                ...conversation,
                receiver_name: user?.full_name || user?.email,
                receiver_avatar: user?.avatar,
                receiver_id: receiverId,
            }
        },
        onSuccess: (conversation) => {
            toast.success('Đã tạo cuộc trò chuyện mới')
            queryClient.invalidateQueries({ queryKey: conversationKeys.list({ userId: currentUserId }) })
            setEmail('')
            setOpen(false)
            onConversationCreated?.(conversation)
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Có lỗi xảy ra khi tạo cuộc trò chuyện')
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.trim()) {
            toast.error('Vui lòng nhập email')
            return
        }
        createConversationMutation.mutate(email.trim())
    }

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
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="user@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={createConversationMutation.isPending}
                                autoFocus
                            />
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
                            {createConversationMutation.isPending ? 'Đang tạo...' : 'Tạo cuộc trò chuyện'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}