import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
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
import { useCreatePermission } from '../hooks'

const createPermissionSchema = z.object({
  key: z.string().min(1, 'Key không được để trống'),
  name: z.string().min(1, 'Tên quyền không được để trống'),
  resource: z.string().min(1, 'Resource không được để trống'),
  action: z.string().min(1, 'Action không được để trống'),
  description: z.string().optional(),
})

type CreatePermissionForm = z.infer<typeof createPermissionSchema>

interface CreatePermissionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreatePermissionDialog({ open, onOpenChange }: CreatePermissionDialogProps) {
  const { mutateAsync: createPermission, isPending } = useCreatePermission()

  const form = useForm<CreatePermissionForm>({
    resolver: zodResolver(createPermissionSchema),
    defaultValues: {
      key: '',
      name: '',
      resource: '',
      action: '',
      description: '',
    },
  })

  const onSubmit = async (data: CreatePermissionForm) => {
    try {
      await createPermission(data)
      form.reset()
      onOpenChange(false)
    } catch (error) {
      // Error handled by mutation
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tạo quyền hạn mới</DialogTitle>
          <DialogDescription>Thêm quyền hạn mới vào hệ thống</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: users:create" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên quyền</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Tạo người dùng" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="resource"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resource</FormLabel>
                    <FormControl>
                      <Input placeholder="VD: users" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="action"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Action</FormLabel>
                    <FormControl>
                      <Input placeholder="VD: create" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả quyền hạn..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Đang tạo...' : 'Tạo quyền'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
