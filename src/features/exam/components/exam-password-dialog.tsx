import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock, AlertCircle } from 'lucide-react'

interface ExamPasswordDialogProps {
  open: boolean
  examTitle: string
  error?: string
  isVerifying: boolean
  onSubmit: (password: string) => void
  onCancel: () => void
}

export function ExamPasswordDialog({
  open,
  examTitle,
  error,
  isVerifying,
  onSubmit,
  onCancel,
}: ExamPasswordDialogProps) {
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password.trim()) {
      onSubmit(password)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isVerifying) {
      onCancel()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            Bài thi yêu cầu mật khẩu
          </DialogTitle>
          <DialogDescription>
            Vui lòng nhập mật khẩu để truy cập bài thi: <strong>{examTitle}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="Nhập mật khẩu bài thi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isVerifying}
                className="border-2"
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isVerifying}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={!password.trim() || isVerifying}>
              {isVerifying ? 'Đang kiểm tra...' : 'Xác nhận'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
