import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, BookOpen, AlertCircle } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClassSchema, type CreateClassForm } from '@/features/teacher/schemas/create-class.schema'
import { currentUserState } from '@/global/recoil/user'
import { useCreateClass } from '../hooks'

export function CreateClassPage() {
    const navigate = useNavigate()
    const currentUser = useRecoilValue(currentUserState)
    
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

    // Auto-fill teacher_id from Recoil state
    useEffect(() => {
        if (currentUser?.user_id) {
            console.log('✅ Setting teacher_id from Recoil:', currentUser.user_id)
            setValue('teacher_id', currentUser.user_id)
        } else {
            console.log('⚠️ User not found in Recoil state')
        }
    }, [currentUser, setValue])

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
                <Card className="w-96">
                    <CardContent className="pt-6">
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
                                <h3 className="font-semibold text-lg">Không có quyền truy cập</h3>
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
        <div className="min-h-screen bg-gray-50">
            <div className="container max-w-4xl mx-auto py-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" asChild>
                            <Link to="/dashboard">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Tạo lớp học mới
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="flex justify-center">
                    {/* Main Content */}
                    <div className="w-full max-w-2xl">
                        <form onSubmit={handleSubmit(onSubmit, onFormError)} className="space-y-6">
                            <Card>
                                <CardHeader className="bg-blue-500 text-white">
                                    <CardTitle className="flex items-center gap-2 text-white">
                                        <BookOpen className="h-5 w-5" />
                                        Thông tin lớp học
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="mt-6 space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="className">
                                                Tên lớp học <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="className"
                                                placeholder="VD: Lập trình hướng đối tượng"
                                                disabled={classMutation.isPending}
                                                {...register('class_name')}
                                            />
                                            <p className="text-xs text-gray-500">
                                                Tên lớp sẽ hiển thị cho học sinh
                                            </p>
                                            {errors.class_name && (
                                                <p className="text-sm text-red-500">{errors.class_name.message}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="classCode">
                                                Mã lớp <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="classCode"
                                                placeholder="VD: CS101"
                                                disabled={classMutation.isPending}
                                                {...register('class_code')}
                                            />
                                            <p className="text-xs text-gray-500">
                                                Mã lớp duy nhất để học sinh tham gia
                                            </p>
                                            {errors.class_code && (
                                                <p className="text-sm text-red-500">{errors.class_code.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">
                                            Mô tả lớp học <span className="text-xs text-gray-500">(Không bắt buộc)</span>
                                        </Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Mô tả ngắn gọn về nội dung và mục tiêu của lớp học..."
                                            className="min-h-24"
                                            disabled={classMutation.isPending}
                                            {...register('description')}
                                        />
                                        <p className="text-xs text-gray-500">
                                            Mô tả sẽ giúp học sinh hiểu rõ hơn về nội dung lớp học
                                        </p>
                                        {errors.description && (
                                            <p className="text-sm text-red-500">{errors.description.message}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                            <div className="flex gap-3">
                                <Button
                                    className="bg-green-600 hover:bg-green-700"
                                    type="submit"
                                    disabled={classMutation.isPending}
                                >
                                    {classMutation.isPending ? 'Đang tạo...' : 'Tạo lớp học'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={classMutation.isPending}
                                    onClick={() => navigate({ to: '/dashboard' })}
                                >
                                    Hủy
                                </Button>
                            </div>
                            {classMutation.isError && (
                                <div className="text-sm text-red-500 mt-2">
                                    Có lỗi xảy ra. Vui lòng thử lại.
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}