import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClassSchema, type CreateClassForm } from '@/features/teacher/schemas/create-class.schema'
import { cookieStorage } from '@/libs/utils/cookie'
import { useCreateClass } from '../hooks'

export function CreateClassPage() {
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

    useEffect(() => {
        const storedUser = cookieStorage.getUser()
        console.log(storedUser)
        if (storedUser && typeof storedUser === 'object' && 'user_id' in storedUser) {
            setValue('teacher_id', storedUser.user_id as number)
        } else {
            console.log('User not found in cookies')
        }
    }, [setValue])

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
                                        <Label htmlFor="description">Mô tả lớp học</Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Mô tả ngắn gọn về nội dung và mục tiêu của lớp học..."
                                            className="min-h-24"
                                            {...register('description')}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                            <Button
                                className="bg-green-600 hover:bg-green-700"
                                type="submit"
                                disabled={classMutation.isPending}
                                onClick={() => {
                                    console.log('🔥 Button clicked!')
                                    console.log('Current errors:', errors)
                                }}
                            >
                                {classMutation.isPending ? 'Đang tạo...' : 'Tạo lớp học'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}