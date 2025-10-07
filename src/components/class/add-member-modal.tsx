import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

interface AddMemberModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  classTitle?: string
  onAddMember?: (email: string) => void
}

export function AddMemberModal({ 
  isOpen, 
  onOpenChange, 
  classTitle = "Group KTPM",
  onAddMember 
}: AddMemberModalProps) {
  const [memberEmail, setMemberEmail] = useState('')

  const handleAddMember = () => {
    if (memberEmail.trim()) {
      onAddMember?.(memberEmail)
      console.log('Adding member:', memberEmail)
      handleClose()
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setMemberEmail('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Add members to {classTitle}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-600 mb-4">
            Start typing a name, distribution list, or security group to add to your team. You can also 
            add people outside your organisation as guests by typing their email addresses. People 
            outside your org will get an email letting them know they've been added.{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Learn about adding guests
            </a>
          </p>
          <Input
            placeholder="Type a name or email"
            value={memberEmail}
            onChange={(e) => setMemberEmail(e.target.value)}
            className="w-full"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && memberEmail.trim()) {
                handleAddMember()
              }
            }}
          />
        </div>
        <DialogFooter className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button 
            disabled={!memberEmail.trim()}
            onClick={handleAddMember}
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}