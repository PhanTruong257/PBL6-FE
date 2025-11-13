import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useRecoilValue } from 'recoil'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { currentUserState } from '@/global/recoil/user'
import { cookieStorage } from '@/libs/utils/cookie'

interface JoinClassModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function JoinClassModal({ isOpen, onOpenChange }: JoinClassModalProps) {
  const [classCode, setClassCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const currentUser = useRecoilValue(currentUserState)
  const navigate = useNavigate()

  const handleJoinClass = async () => {
    if (!classCode.trim()) {
      toast.error('Vui lòng nhập mã lớp học')
      return
    }

    if (!currentUser?.user_id) {
      toast.error('Vui lòng đăng nhập')
      return
    }

    setIsLoading(true)

    try {
      const token = cookieStorage.getAccessToken()
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/classes/join-by-code`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            class_code: classCode.trim(),
            user_id: currentUser.user_id,
          }),
        }
      )

      const result = await response.json()

      if (result.success) {
        toast.success('Tham gia lớp học thành công!')
        setClassCode('')
        onOpenChange(false)
        
        // Navigate to the class detail page if class_id is returned
        if (result.data?.class_id) {
          navigate({
            to: '/classes/detail-class',
            search: { id: result.data.class_id },
          })
        } else {
          // Refresh the page to show the new class
          window.location.reload()
        }
      } else {
        toast.error(result.message || 'Không thể tham gia lớp học')
      }
    } catch (error) {
      console.error('Error joining class:', error)
      toast.error('Có lỗi xảy ra khi tham gia lớp học')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleJoinClass()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tham gia lớp học</DialogTitle>
          <DialogDescription>
            Nhập mã lớp học để tham gia vào lớp
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="class-code">Mã lớp học</Label>
            <Input
              id="class-code"
              placeholder="Nhập mã lớp học..."
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              autoFocus
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button onClick={handleJoinClass} disabled={isLoading}>
            {isLoading ? 'Đang tham gia...' : 'Tham gia'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
