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
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { cookieStorage } from '@/libs/utils/cookie'
import { useQueryClient } from '@tanstack/react-query'
import { useRecoilValue } from 'recoil'
import { currentUserState } from '@/global/recoil/user'
import { useAllUsers, useSearchUsers } from '@/global/hooks'

interface AddMemberModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  classInfo: ClassBasicInfo
}

export function AddMemberModal({
  isOpen,
  onOpenChange,
  classInfo,
}: AddMemberModalProps) {
  const [searchText, setSearchText] = useState<string>('')
  const [openMatchedList, setOpenMatchedList] = useState<boolean>(false)
  const [selectedEmails, setSelectedEmails] = useState<string[]>([])
  const queryClient = useQueryClient()
  const currentUser = useRecoilValue(currentUserState)

  // Fetch all users once and cache in Recoil
  const { isLoading: isLoadingUsers } = useAllUsers({ autoFetch: true })

  // Client-side search from cached users
  const { users: matchedUserList } = useSearchUsers(
    searchText,
    currentUser?.user_id,
  )

  const fetchUserProfileFromEmail = async (emails: string[]) => {
    try {
      const token = cookieStorage.getAccessToken()
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/users/get-list-profile-by-emails`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userEmails: emails,
          }),
        },
      )

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
    if (selectedEmails.length === 0) {
      alert('Vui lòng chọn ít nhất một sinh viên')
      return
    }

    try {
      const users = await fetchUserProfileFromEmail(selectedEmails)

      if (users.length === 0) {
        alert('Không tìm thấy người dùng nào với email đã chọn')
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
          lastName: lastName,
        }
      })

      const token = cookieStorage.getAccessToken()
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/classes/add-students`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            students: students,
            class_id: classInfo.class_id,
          }),
        },
      )

      if (!res.ok) {
        throw new Error('Failed to add students')
      }

      const json = await res.json()
      console.log('Response:', json)

      if (json.success) {
        // Invalidate queries to refresh student count and list
        queryClient.invalidateQueries({
          queryKey: ['class-students', classInfo.class_id],
        })
        queryClient.invalidateQueries({
          queryKey: ['class-students-count', classInfo.class_id],
        })
        queryClient.invalidateQueries({ queryKey: ['teacher-classes'] })
        queryClient.invalidateQueries({ queryKey: ['student-classes'] })

        alert(`Đã thêm ${students.length} sinh viên thành công!`)
        handleClose()
      } else {
        alert('Có lỗi xảy ra: ' + (json.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error adding members:', error)
      alert('Có lỗi xảy ra khi thêm học sinh')
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setSearchText('')
    setSelectedEmails([])
    setOpenMatchedList(false)
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchText(value)

    if (!value.trim()) {
      setOpenMatchedList(false)
    } else {
      setOpenMatchedList(true)
    }
  }

  const handleChooseUserClick = (user: any) => {
    // Add email to selected list if not already added
    if (!selectedEmails.includes(user.email)) {
      setSelectedEmails([...selectedEmails, user.email])
    }
    setSearchText('')
    setOpenMatchedList(false)
  }

  const handleRemoveSelectedEmail = (emailToRemove: string) => {
    setSelectedEmails(selectedEmails.filter((email) => email !== emailToRemove))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Add members to {classInfo.class_name}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <p className="text-sm text-gray-600">
            Gõ tên hoặc email sinh viên để tìm kiếm và thêm vào lớp học.
          </p>

          {/* Selected emails display */}
          {selectedEmails.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border">
              {selectedEmails.map((email) => (
                <div
                  key={email}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  <span>{email}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSelectedEmail(email)}
                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="relative">
            <Input
              placeholder="Gõ tên hoặc email sinh viên (ví dụ: 'anh', 'nguyen'...)"
              value={searchText}
              onChange={handleOnChange}
              className="w-full"
              onBlur={() => setTimeout(() => setOpenMatchedList(false), 200)}
              onFocus={() => searchText.trim() && setOpenMatchedList(true)}
            />

            {openMatchedList && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-80 overflow-auto">
                {isLoadingUsers ? (
                  <div className="flex items-center justify-center py-8 text-gray-500">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                    <span>Đang tải danh sách...</span>
                  </div>
                ) : matchedUserList.length > 0 ? (
                  <div className="py-1">
                    {matchedUserList.map((user) => {
                      const isSelected = selectedEmails.includes(user.email)
                      return (
                        <button
                          key={user.user_id}
                          type="button"
                          disabled={isSelected}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                            isSelected
                              ? 'bg-gray-100 cursor-not-allowed opacity-60'
                              : 'hover:bg-blue-50 focus:bg-blue-50'
                          }`}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() =>
                            !isSelected && handleChooseUserClick(user)
                          }
                        >
                          <Avatar className="w-10 h-10 flex-shrink-0">
                            <AvatarImage
                              src={user.avatar ?? '/placeholder-avatar.jpg'}
                              className="rounded-full object-cover w-full h-full"
                            />
                            <AvatarFallback className="bg-blue-500 text-white font-semibold rounded-full flex items-center justify-center w-full h-full">
                              {(user.full_name || user.email)
                                .charAt(0)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate">
                              {user.full_name || 'Chưa có tên'}
                            </div>
                            <div className="text-sm text-gray-500 truncate">
                              {user.email}
                            </div>
                          </div>
                          {isSelected && (
                            <svg
                              className="w-5 h-5 text-green-600 flex-shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    <svg
                      className="w-12 h-12 mx-auto mb-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <p>Không tìm thấy sinh viên nào</p>
                    <p className="text-xs mt-1">Thử tìm với từ khóa khác</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleClose}>
            Hủy
          </Button>
          <Button
            disabled={selectedEmails.length === 0}
            onClick={handleAddMember}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Thêm {selectedEmails.length > 0 && `(${selectedEmails.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
