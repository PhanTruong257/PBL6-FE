import { useEffect, useState } from 'react'
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
import { type User } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { cookieStorage } from '@/libs/utils/cookie'
import { useQueryClient } from '@tanstack/react-query'


interface AddMemberModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  classInfo: ClassBasicInfo
}

// const users: User[]=[{
//   user_id: '1',
//   role: 'teacher',
//   fullName: 'abc',
//   email:"abc@gmail.com",
//   isEmailVerified:true,
//   status:'active',
//   createdAt: '',
//   updatedAt: '',
// },
// {
//   user_id: '2',
//   role: 'teacher',
//   fullName: 'abc',
//   email:"abc123@gmail.com",
//   isEmailVerified:true,
//   status:'active',
//   createdAt: '',
//   updatedAt: '',
// },
// {
//   user_id: '3',
//   role: 'teacher',
//   fullName: 'abc',
//   email:"abc789@gmail.com",
//   isEmailVerified:true,
//   status:'active',
//   createdAt: '',
//   updatedAt: '',
// }]

export function AddMemberModal({ 
  isOpen, 
  onOpenChange, 
  classInfo
}: AddMemberModalProps) {
  const [lastMemberEmail, setLastMemberEmail] = useState<string>('');
  const [matchedUserList, setMatchedUserList] = useState<Array<User>>([]);
  const [openMatchedList, setOpenMatchedList] = useState<boolean>(false);
  const [textInput, setTextInput] = useState<string>('');
  const queryClient = useQueryClient();

  const fetchUserProfileFromEmail = async(emails: string[]) => {
    try {
      const token = cookieStorage.getAccessToken()
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/get-list-profile-by-emails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userEmails: emails
        })
      })
      
      if (!res.ok) {
        throw new Error('Failed to fetch user profiles')
      }
      
      const json = await res.json()
      // Backend returns { data: { users: [...] } }
      return json.data?.users || []
    } catch (error) {
      console.error('Error fetching user profiles:', error)
      return []
    }
  }

  const handleAddMember = async () => {
    if (textInput.length > 0) {
      try {
        const emailList = textInput.trim().split(/\s+/)
        const users = await fetchUserProfileFromEmail(emailList)
        
        if (users.length === 0) {
          alert('Không tìm thấy người dùng nào với email đã nhập')
          return
        }

        // Map users to required format for API (UserInfoDto)
        const students = users.map((user: any) => {
          // Split full_name into firstName and lastName
          const nameParts = (user.full_name || '').trim().split(' ')
          const firstName = nameParts[0] || ''
          const lastName = nameParts.slice(1).join(' ') || ''
          
          return {
            id: user.user_id,
            email: user.email,
            firstName: firstName,
            lastName: lastName
          }
        })

        const token = cookieStorage.getAccessToken()
        const res = await fetch(`${import.meta.env.VITE_API_URL}/classes/add-students`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            students: students,
            class_id: classInfo.class_id,
          })
        })

        if (!res.ok) {
          throw new Error('Failed to add students')
        }

        const json = await res.json()
        console.log('Response:', json)
        
        if (json.success) {
          // Invalidate queries to refresh student count and list
          queryClient.invalidateQueries({ queryKey: ['class-students', classInfo.class_id] })
          queryClient.invalidateQueries({ queryKey: ['class-students-count', classInfo.class_id] })
          
          alert('Đã thêm học sinh thành công!')
          handleClose()
        } else {
          alert('Có lỗi xảy ra: ' + (json.message || 'Unknown error'))
        }
      } catch (error) {
        console.error('Error adding members:', error)
        alert('Có lỗi xảy ra khi thêm học sinh')
      }
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setTextInput('')
  }

  const searchUserMatchEmailPattern = async (emailPattern: string) => {
    try {
      const token = cookieStorage.getAccessToken()
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/get-list-profile-match-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          emailPattern,
        }),
      })
      
      if (!res.ok) {
        throw new Error('Failed to search users')
      }
      
      const json = await res.json()
      // Backend returns { data: { users: [...] } }
      return json.data?.users || []
    } catch (error) {
      console.error('Error searching users:', error)
      return []
    }
  }


  const handleOnChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    setTextInput(e.target.value)
    if (!e.target.value || e.target.value[e.target.value.length-1]===' '){
      setOpenMatchedList(false)
      return;
    }
    setOpenMatchedList(true);
    const emailList = e.target.value.trim().split(/\s+/);
    const lastEmail = emailList[emailList.length - 1];
    if (lastEmail === lastMemberEmail) return;
    setLastMemberEmail(lastEmail);
  }

  useEffect(()=>{
    if (!lastMemberEmail.trim()) return;

    const timer = setTimeout(async ()=>{
      const userList:User[] = await searchUserMatchEmailPattern(lastMemberEmail.trim());
      setMatchedUserList(userList);
    }, 2000);    

    return ()=>clearTimeout(timer);

  },[lastMemberEmail])

  const handleChooseUserClick = async (email:string)=>{
    const emailList = textInput.trim().split(/\s+/);
    emailList[emailList.length-1]=email
    setTextInput(emailList.join(' '));
    setOpenMatchedList(false);
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
          <div className="relative w-full max-w-xs">
            <Input
              placeholder="Type a name or email"
              value={textInput}
              onChange={(e)=> handleOnChange(e)}
              className="w-full"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && textInput.trim()) {
                  handleAddMember()
                }
              }}
              onBlur={() => setTimeout(() => setOpenMatchedList(false), 100)}
            />
            {openMatchedList && matchedUserList.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                {matchedUserList.map(user => (
                  <button
                    key={user.user_id}
                    id={user.email}
                    type="button"
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 text-left"
                    onMouseDown={e => e.preventDefault()}
                    onClick={()=>handleChooseUserClick(user.email)}
                  >
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={user.avatar ?? '/placeholder-avatar.jpg'} />
                      <AvatarFallback className="bg-gray-400 text-white text-xs">{user.email.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-gray-900 text-sm">{user.email}</span>
                    <span className="text-xs text-gray-500 ml-2">{user.email}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button 
            disabled={!textInput.trim()}
            onClick={handleAddMember}
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}