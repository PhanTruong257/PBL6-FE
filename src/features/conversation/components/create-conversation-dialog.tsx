import { useState } from 'react'
import { Plus, UserPlus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useUsers } from '@/features/manage-user/hooks'
import { useCreateConversation } from '../hooks'
import type { User } from '@/types'

interface CreateConversationDialogProps {
    currentUserId: number
    onConversationCreated?: (conversationId: number) => void
}

export function CreateConversationDialog({
    currentUserId,
    onConversationCreated
}: CreateConversationDialogProps) {
    const [open, setOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedUsers, setSelectedUsers] = useState<number[]>([])
    const [conversationName, setConversationName] = useState('')

    const { data: usersData, isLoading } = useUsers(
        {
            text: searchQuery,
            page: 1,
            limit: 50
        },
        open // Only fetch when dialog is open
    )
    const createConversationMutation = useCreateConversation()

    const users = usersData?.data.users || []
    const filteredUsers = users.filter((user: User) => user.user_id !== currentUserId)

    const handleUserToggle = (userId: number) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        )
    }

    const handleCreateConversation = async () => {
        if (selectedUsers.length === 0) return

        try {
            // For individual conversation
            const result = await createConversationMutation.mutateAsync({
                receiver_id: selectedUsers[0],
            })
            onConversationCreated?.(result.data.id)
            handleReset()
        } catch (error) {
            console.error('Failed to create conversation:', error)
        }
    }

    const handleReset = () => {
        setOpen(false)
        setSearchQuery('')
        setSelectedUsers([])
        setConversationName('')
    }

    const isGroupConversation = selectedUsers.length > 1
    const canCreate = selectedUsers.length > 0 && (!isGroupConversation || conversationName.trim())

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen)
            if (!isOpen) handleReset()
        }}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Tạo cuộc trò chuyện
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5" />
                        Tạo cuộc trò chuyện mới
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Search Users */}
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Tìm kiếm người dùng..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    {/* Group Name (only for groups) */}
                    {isGroupConversation && (
                        <div>
                            <Input
                                placeholder="Tên nhóm trò chuyện..."
                                value={conversationName}
                                onChange={(e) => setConversationName(e.target.value)}
                            />
                        </div>
                    )}

                    {/* Selected Users */}
                    {selectedUsers.length > 0 && (
                        <div className="space-y-2">
                            <div className="text-sm font-medium">
                                Đã chọn ({selectedUsers.length})
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {selectedUsers.map(userId => {
                                    const user = users.find((u: User) => u.user_id === userId)
                                    return user ? (
                                        <Badge
                                            key={userId}
                                            variant="secondary"
                                            className="gap-1 cursor-pointer"
                                            onClick={() => handleUserToggle(userId)}
                                        >
                                            {user.full_name || user.email}
                                            <span className="ml-1 text-xs">×</span>
                                        </Badge>
                                    ) : null
                                })}
                            </div>
                            <Separator />
                        </div>
                    )}

                    {/* Users List */}
                    <ScrollArea className="h-64">
                        {isLoading ? (
                            <div className="flex items-center justify-center p-8">
                                <div className="text-sm text-muted-foreground">Đang tải...</div>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="flex items-center justify-center p-8">
                                <div className="text-sm text-muted-foreground">
                                    {searchQuery ? 'Không tìm thấy người dùng' : 'Không có người dùng'}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {filteredUsers.map((user: User) => (
                                    <div
                                        key={user.user_id}
                                        className="flex items-center gap-3 rounded-lg p-3 hover:bg-muted/50 cursor-pointer"
                                        onClick={() => handleUserToggle(user.user_id)}
                                    >
                                        <Checkbox
                                            checked={selectedUsers.includes(user.user_id)}
                                            onChange={() => handleUserToggle(user.user_id)}
                                        />

                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.avatar} />
                                            <AvatarFallback className="text-xs">
                                                {(user.full_name || user.email).charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm truncate">
                                                {user.full_name || user.email}
                                            </div>
                                            {user.email && (
                                                <div className="text-xs text-muted-foreground truncate">
                                                    {user.email}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                        <Button
                            variant="outline"
                            onClick={handleReset}
                            className="flex-1"
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleCreateConversation}
                            disabled={!canCreate || createConversationMutation.isPending}
                            className="flex-1"
                        >
                            {createConversationMutation.isPending ? 'Đang tạo...' : 'Tạo'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}