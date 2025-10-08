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
import type { ClassBasicInfo } from '@/types/class'

interface AddMemberModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  classInfo: ClassBasicInfo
}

export function AddMemberModal({ 
  isOpen, 
  onOpenChange, 
  classInfo
}: AddMemberModalProps) {
  const [memberEmail, setMemberEmail] = useState<string>('')

  const fetchUserProfileFromEmail = async(email: string)=>{
    const res = await fetch(`${import.meta.env.VITE_API_URL}/users/get-list-profile-by-email`,
        {
          method: 'POST',
          headers: {
            authorization: `bearer `,             
          }, 
          body: JSON.stringify({
            userEmails: [email]
          })
        }
      );
      const json = res.json();
      return json;
  }

  const handleAddMember = async () => {
    if (memberEmail.length > 0) {
      const users = await fetchUserProfileFromEmail(memberEmail);
      

      const res = await fetch(`${import.meta.env.VITE_API_URL}/classes/add-students`,
        {
          method: 'POST',
          headers: {
            authorization: `bearer `,             
          }, 
          body: JSON.stringify({
            students: users,
            class_id: classInfo.class_id,
          })
        }
      );
      const json = res.json();

      console.log('reponse: ' + json)
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
            Add members to {classInfo.class_name}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-600 mb-4">
            Start typing a name to add to your team. You can also 
            add people outside your organisation as guests by typing their email addresses. People 
            outside your org will get an email letting them know they've been added.
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