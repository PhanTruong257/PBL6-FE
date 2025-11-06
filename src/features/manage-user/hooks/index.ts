import { useState } from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteUser } from '../api'
import type { UserFilters } from '../types'
import { UserService } from '../api/use-service'


export const useCreateUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: any) => {
      // Convert object to FormData if needed
      const formData = new FormData()
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key])
        }
      })
      return UserService.createUser(formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
      toast.success('Tạo người dùng thành công')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Có lỗi xảy ra khi tạo người dùng')
    },
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (params: { id: string; data: any }) => {
      // Convert object to FormData if needed
      const formData = new FormData()
      Object.keys(params.data).forEach(key => {
        if (params.data[key] !== undefined && params.data[key] !== null) {
          formData.append(key, params.data[key])
        }
      })
      
      return UserService.updateUser(params.id, formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
      queryClient.invalidateQueries({ queryKey: ['teacher'] })
      toast.success('Cập nhật người dùng thành công')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Có lỗi xảy ra khi cập nhật người dùng')
    },
  })
}


export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
      toast.success('Xóa người dùng thành công')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Có lỗi xảy ra khi xóa người dùng')
    },
  })
}



export const useUserFilters = () => {
  const [filters, setFilters] = useState<UserFilters>({
    text: '',
    status: '',
    sortBy: 'name',
    sortOrder: 'asc',
    role: undefined,
    gender: undefined,
    page: 1,
    limit: 2,
  })

  const updateFilters = (newFilters: Partial<UserFilters>) => {
    console.log('Updating filters with', newFilters)
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const resetFilters = () => {
    setFilters({
      text: '',
      status: '',
      sortBy: 'name',
      sortOrder: 'asc',
      role: undefined,
      gender: undefined,
      page:1,
      limit:2,
    })
  }

  return { filters, updateFilters, resetFilters }
}

export const useUsers = (
  filters: Partial<UserFilters>,
  enabled = true
) => {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => UserService.getUsers(filters as UserFilters),
    enabled,
  })
}
