import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, BookOpen, AlertCircle, RefreshCw } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import {
  createClassSchema,
  type CreateClassForm,
} from '@/features/teacher/schemas/create-class.schema'
import { currentUserState } from '@/global/recoil/user'
import { useCreateClass } from '../hooks'

// Hàm tạo mã lớp ngẫu nhiên
function generateClassCode(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  let code = ''

  // 2 chữ cái đầu
  for (let i = 0; i < 2; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length))
  }

  // 4 số
  for (let i = 0; i < 4; i++) {
    code += numbers.charAt(Math.floor(Math.random() * numbers.length))
  }

  return code
}

export function CreateClassPage() {
  const navigate = useNavigate()
  const currentUser = useRecoilValue(currentUserState)
  const [classCode, setClassCode] = useState(generateClassCode())

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateClassForm>({
    resolver: zodResolver(createClassSchema),
  })

  const classMutation = useCreateClass()

  const onSubmit = (data: CreateClassForm) => {
    console.log('✅ onSubmit called!')
    console.log('Creating class with data:', data)
    classMutation.mutate(data)
  }

  const onFormError = (formErrors: any) => {
    console.log('❌ Form validation errors:', formErrors)
  }

  // Auto-fill teacher_id and class_code from Recoil state
  useEffect(() => {
    if (currentUser?.user_id) {
      console.log('✅ Setting teacher_id from Recoil:', currentUser.user_id)
      setValue('teacher_id', currentUser.user_id)
    } else {
      console.log('⚠️ User not found in Recoil state')
    }
    setValue('class_code', classCode)
  }, [currentUser, setValue, classCode])

  // Redirect if user is not a teacher
  useEffect(() => {
    if (currentUser && currentUser.role !== 'teacher') {
      console.log('⚠️ User is not a teacher, redirecting to dashboard')
      navigate({ to: '/dashboard' })
    }
  }, [currentUser, navigate])

  // Show loading if user data not yet loaded
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96" style={{ padding: 8 }}>
          <CardContent className="pt-6" style={{ padding: 8 }}>
            <div className="text-center">
              <p className="text-gray-600">Đang tải thông tin người dùng...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show error if user is not a teacher
  if (currentUser.role !== 'teacher') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
              <div>
                <h3 className="font-semibold text-lg">
                  Không có quyền truy cập
                </h3>
                <p className="text-gray-600 mt-2">
                  Chỉ giáo viên mới có thể tạo lớp học
                </p>
              </div>
              <Button onClick={() => navigate({ to: '/dashboard' })}>
                Quay về Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-3">
          <Link to="/classes">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Link>
        </Button>
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookOpen className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Tạo lớp học mới</h1>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit, onFormError)}
        className="space-y-4"
      >
        {/* Main Card */}
        <Card className="border-0 shadow-sm">
          <CardContent>
            {/* Tên lớp học */}
            <div className="space-y-2">
              <Label
                htmlFor="className"
                className="text-base font-semibold text-gray-700"
              >
                Tên lớp học <span className="text-red-500">*</span>
              </Label>
              <Input
                id="className"
                placeholder="Nhập tên lớp học (VD: Lập trình hướng đối tượng)"
                disabled={classMutation.isPending}
                {...register('class_name')}
                className="h-10 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.class_name && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.class_name.message}
                </p>
              )}
            </div>

            {/* Mã lớp */}
            <div className="space-y-2">
              <Label
                htmlFor="classCode"
                className="text-base font-semibold text-gray-700"
              >
                Mã lớp <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <div>
                  <Input
                    id="classCode"
                    value={classCode}
                    disabled={classMutation.isPending}
                    readOnly
                    {...register('class_code')}
                    className="h-10 w-30 text-lg font-bold text-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-center tracking-wider"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10   border-gray-200 hover:bg-gray-50 hover:border-blue-300 transition-colors"
                  disabled={classMutation.isPending}
                  onClick={() => {
                    const newCode = generateClassCode()
                    setClassCode(newCode)
                    setValue('class_code', newCode)
                  }}
                >
                  <RefreshCw className="h-4 w-4  " />
                  Tạo mã khác
                </Button>
              </div>
            </div>

            {/* Mô tả */}
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-base font-semibold text-gray-700"
              >
                Mô tả lớp học{' '}
                <span className="text-gray-400 text-sm font-normal">
                  (Không bắt buộc)
                </span>
              </Label>
              <Textarea
                id="description"
                placeholder="Nhập mô tả về nội dung, mục tiêu của lớp học..."
                className="min-h-[90px] text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                disabled={classMutation.isPending}
                {...register('description')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-2 ">
          <Button
            type="button"
            variant="outline"
            className="px-6 h-10 border-gray-200 hover:bg-gray-50"
            disabled={classMutation.isPending}
            onClick={() => navigate({ to: '/classes' })}
          >
            Hủy bỏ
          </Button>
          <Button
            className="px-6 h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
            type="submit"
            disabled={classMutation.isPending}
          >
            {classMutation.isPending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Đang tạo lớp...
              </>
            ) : (
              <>
                <BookOpen className="mr-2 h-4 w-4" />
                Tạo lớp học
              </>
            )}
          </Button>
        </div>

        {classMutation.isError && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm font-medium">
                  Có lỗi xảy ra khi tạo lớp học. Vui lòng thử lại.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  )
}
