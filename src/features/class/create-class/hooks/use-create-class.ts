import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { ClassService, type CreateClassRequest } from '@/features/teacher/api/class-service'

export function useCreateClass() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateClassRequest) => ClassService.CreateClass(data),
        onSuccess: (response) => {
            console.log('Class created successfully:', response)
            // Navigate to the new class or dashboard
            navigate({ to: '/dashboard' })
            // Invalidate classes list to refetch
            queryClient.invalidateQueries({ queryKey: ['classes'] })
        },
        onError: (error) => {
            console.error('Error creating class:', error)
        }
    })
}