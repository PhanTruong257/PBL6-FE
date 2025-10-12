import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { ClassService, type CreateClassRequest } from '../api/class-service'

export function useClass() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateClassRequest) => ClassService.CreateClass(data),
    onSuccess: (response) => {
      console.log(response);
    },
  })
}
