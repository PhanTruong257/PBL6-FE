import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

import {
  UserFiltersComponent,
  UserTable,
  CreateUserDialog,
  EditUserDialog,
  UserDetailDialog,
} from '../components'
import {
  useCreateUser,
  useUpdateUser,
  useUserFilters,
} from '../hooks'

import type { CreateUserFormData, UpdateUserFormData } from '../schemas'
import { useUser } from '../hooks/use-user'
import type { User } from '@/types'

export function ManageUserPage() {
  // State management
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDetailDialog, setShowDetailDialog] = useState(false)

  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Filters
  const { filters, updateFilters, resetFilters } = useUserFilters()

  useEffect(() => {
    console.log('Selected User:', selectedUser)
  }, [selectedUser])

  // API hooks
  const { data: userData, isLoading } = useUser(filters)
  const createMutation = useCreateUser()
  const updateMutation = useUpdateUser()


  const users = userData?.data.users || []
  const total = userData?.data.total || 0
  const perPage = userData?.data.limit || 10


  // Event handlers
  const handleCreateUser = (data: CreateUserFormData) => {
    console.log('Creating user with data:', data)
    createMutation.mutate(data, {
      onSuccess: () => {
        setShowCreateDialog(false)
      },
    })
  }

  const handleEditUser = (data: UpdateUserFormData) => {
    if (!selectedUser) return
    console.log('Editing user with data:', data)
    console.log('Selected user ID:', selectedUser.user_id)
    updateMutation.mutate(
      { id: selectedUser.user_id.toString(), data },
      {
        onSuccess: () => {
          setShowEditDialog(false)
          setSelectedUser(null)
        },
      }
    )
  } 



  const handleToggleStatus = (user: User) => {
    const newStatus = user.status === 'active' ? 'blocked' : 'active'
    updateMutation.mutate({
      id: user.user_id.toString(),
      data: { status: newStatus },
    })
  }

  const handleView = (user: User) => {
    setSelectedUser(user)
    setShowDetailDialog(true)
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setShowEditDialog(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý người dùng</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý thông tin và quyền hạn của người dùng trong hệ thống
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Thêm người dùng
        </Button>
      </div>

      {/* Filters */}
      <UserFiltersComponent
        filters={filters}
        onFiltersChange={updateFilters}
        onReset={resetFilters}
      />

      {/* Users Table */}
      <UserTable
        users={users}
        total={total}
        itemsPerPage={perPage}
        loading={isLoading}
        currentPage={filters.page}
        onChangePage={(page: number) => updateFilters({ page })}
        onView={handleView}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
      />

      {/* Create Dialog */}
      <CreateUserDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSubmit={handleCreateUser}
        loading={createMutation.isPending}
      />

      {/* Edit Dialog */}
      <EditUserDialog
        open={showEditDialog}
        onClose={() => {
          setShowEditDialog(false)
          setSelectedUser(null)
        }}
        onSubmit={handleEditUser}
        user={selectedUser}
        loading={updateMutation.isPending}
      />

      {/* Detail Dialog */}
      <UserDetailDialog
        open={showDetailDialog}
        onClose={() => {
          setShowDetailDialog(false)
          setSelectedUser(null)
        }}
        user={selectedUser}
      />

    </div>
  )
}

// Legacy export for backward compatibility
export const ManageTeacherPage = ManageUserPage
