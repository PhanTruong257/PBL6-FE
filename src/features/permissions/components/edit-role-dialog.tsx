import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useUpdateRole } from '../hooks'
import type { Role } from '../types'

const editRoleSchema = z.object({
  displayText: z.string().min(1, 'Tên hiển thị không được để trống'),
  description: z.string().optional(),
})

type EditRoleForm = z.infer<typeof editRoleSchema>

interface EditRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: Role | null
}

export function EditRoleDialog({ open, onOpenChange, role }: EditRoleDialogProps) {
  const { mutateAsync: updateRole, isPending } = useUpdateRole()

  const form = useForm<EditRoleForm>({
    resolver: zodResolver(editRoleSchema),
    defaultValues: {
      displayText: '',
      description: '',
    },
  })

  // Update form when role changes
  useEffect(() => {
    if (role) {
      form.reset({
        displayText: role.displayText || '',
        description: role.description || '',
      })
    }
  }, [role, form])

  const onSubmit = async (data: EditRoleForm) => {
    if (!role) return

    try {
      await updateRole({
        roleId: role.role_id,
        data,
      })
      onOpenChange(false)
    } catch (error) {
      // Error handled by mutation
    }
  }

  if (!role) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa vai trò</DialogTitle>
          <DialogDescription>Cập nhật thông tin vai trò trong hệ thống</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Code vai trò (Không thể thay đổi)
              </label>
              <Input value={role?.name || ''} disabled className="bg-muted" />
            </div>
            <FormField
              control={form.control}
              name="displayText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên hiển thị *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: Manager" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả về vai trò này..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  'Lưu thay đổi'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
