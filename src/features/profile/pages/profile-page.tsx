import { useState, useRef, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon, Phone, Upload, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { cn } from '@/libs/utils'

import { useProfile, useUpdateProfile, useUploadAvatar, useChangePassword } from '../hooks'
import { profileSchema, changePasswordSchema } from '../schemas'
import type { ProfileFormData, ChangePasswordFormData } from '../schemas'

export function ProfilePage() {
  const [date, setDate] = useState<Date>()
  const [selectedTab, setSelectedTab] = useState('personal-info')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Hooks
  const { data: profile } = useProfile()
  const updateProfileMutation = useUpdateProfile()
  const uploadAvatarMutation = useUploadAvatar()
  const changePasswordMutation = useChangePassword()

  // Profile form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    control,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      gender: 'male',
    },
  })

  // Password change form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  })

  // Update form when profile data loads
  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.full_name,
        email: profile.email,
        phone: profile.phone || '',
        address: profile.address || '',
        gender: profile.gender || 'male',
      })

      if (profile.dateOfBirth) {
        const birthDate = new Date(profile.dateOfBirth)
        setDate(birthDate)
        setValue('dateOfBirth', birthDate)
      }
    }
  }, [profile, reset, setValue])

  const onSubmit = (data: ProfileFormData) => {
    const updateData = {
      full_name: data.fullName,
      phone: data.phone,
      address: data.address,
      bio: data.bio,
      dateOfBirth: data.dateOfBirth?.toISOString(),
      gender: data.gender,
    }
    console.log('Submitting profile update:', updateData)
    updateProfileMutation.mutate(updateData)
  }

  const onPasswordSubmit = (data: ChangePasswordFormData) => {
    changePasswordMutation.mutate(data, {
      onSuccess: () => {
        resetPasswordForm()
      },
    })
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      uploadAvatarMutation.mutate(file)
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    setValue('dateOfBirth', selectedDate)
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <Card>
        <CardContent className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/3">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder-avatar.jpg" />
                      <AvatarFallback className="bg-blue-500 text-white text-xl">
                        D
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                      onClick={handleAvatarClick}
                      disabled={uploadAvatarMutation.isPending}
                    >
                      <Upload className="h-3 w-3" />
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </div>

                  <div className="text-center">
                    <h3 className="font-semibold text-lg">
                      {profile ? `${profile.full_name}` : 'Ngô Văn Danh'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Sinh viên • Công nghệ thông tin
                    </p>
                  </div>

                  <Button variant="outline" size="sm" className="w-full">
                    Thông tin cơ bản
                  </Button>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Mã sinh viên</Label>
                    <p className="font-medium">2021601234</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Lớp</Label>
                    <p className="font-medium">CNTT-K15A</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Khóa học</Label>
                    <p className="font-medium">2021-2025</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Chuyên ngành</Label>
                    <p className="font-medium">Công nghệ phần mềm</p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div>
                  <Label className="text-xs text-muted-foreground">Liên hệ</Label>
                  <div className="space-y-2 mt-2">
                    <div>
                      <Label className="text-xs">Email</Label>
                      <p className="text-sm">{profile?.email || 'duy.danh@student.edu.vn'}</p>
                    </div>
                    <div>
                      <Label className="text-xs">Điện thoại</Label>
                      <p className="text-sm">{profile?.phone || '0987 654 321'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:w-2/3">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="personal-info">Thông tin cá nhân</TabsTrigger>
                <TabsTrigger value="security">Bảo mật</TabsTrigger>
                <TabsTrigger value="notifications">Thông báo</TabsTrigger>
              </TabsList>

              <TabsContent value="personal-info" className="min-h-[600px] space-y-6 mt-0">
                <div>
                  {/* Left Column - Avatar and Basic Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Thông tin cá nhân
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-1">
                          <div className="space-y-2">
                            <Label htmlFor="fullName">Họ và tên *</Label>
                            <Input
                              id="fullName"
                              {...register('fullName')}
                            />
                            {errors.fullName && (
                              <p className="text-sm text-red-500">{errors.fullName.message}</p>
                            )}
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Ngày sinh</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    'w-full justify-start text-left font-normal',
                                    !date && 'text-muted-foreground'
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {date ? (
                                    format(date, 'dd/MM/yyyy', { locale: vi })
                                  ) : (
                                    <span>10/10/2004</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={date}
                                  onSelect={handleDateSelect}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div className="space-y-2 w-full">
                            <Label>Giới tính</Label>
                            <Controller
                              name="gender"
                              control={control}
                              render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Chọn giới tính" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="male">Nam</SelectItem>
                                    <SelectItem value="female">Nữ</SelectItem>
                                    <SelectItem value="other">Khác</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </div>
                        </div>
                      </form>
                    </CardContent>
                  </Card>

                  <Card className="mt-6">
                    <CardHeader className="flex" >
                      <Phone className="h-4 w-4" />
                      <CardTitle>Thông tin liên hệ</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          {...register('email')}
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500">{errors.email.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input
                          id="phone"
                          {...register('phone')}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Địa chỉ</Label>
                        <Input
                          id="address"
                          {...register('address')}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="security" className="min-h-[600px] space-y-6 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Bảo mật tài khoản</CardTitle>
                    <CardDescription>
                      Quản lý mật khẩu và các thiết lập bảo mật khác
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          placeholder="••••••••"
                          {...registerPassword('currentPassword')}
                        />
                        {passwordErrors.currentPassword && (
                          <p className="text-sm text-red-500">{passwordErrors.currentPassword.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Mật khẩu mới</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder="••••••••"
                          {...registerPassword('newPassword')}
                        />
                        {passwordErrors.newPassword && (
                          <p className="text-sm text-red-500">{passwordErrors.newPassword.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          {...registerPassword('confirmPassword')}
                        />
                        {passwordErrors.confirmPassword && (
                          <p className="text-sm text-red-500">{passwordErrors.confirmPassword.message}</p>
                        )}
                      </div>

                      <div className="flex justify-end gap-2 mt-6">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => resetPasswordForm()}
                        >
                          Hủy bỏ
                        </Button>
                        <Button
                          type="submit"
                          disabled={changePasswordMutation.isPending}
                        >
                          {changePasswordMutation.isPending ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="min-h-[600px] space-y-6 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Cài đặt thông báo</CardTitle>
                    <CardDescription>
                      Quản lý các loại thông báo bạn muốn nhận
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Thông báo email</h4>
                          <p className="text-sm text-muted-foreground">Nhận thông báo qua email về các cập nhật quan trọng</p>
                        </div>
                        <Button variant="outline" size="sm">Đang phát triển</Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Thông báo khóa học</h4>
                          <p className="text-sm text-muted-foreground">Nhận thông báo về các khóa học mới và cập nhật</p>
                        </div>
                        <Button variant="outline" size="sm">Đang phát triển</Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Thông báo điểm số</h4>
                          <p className="text-sm text-muted-foreground">Nhận thông báo khi có điểm mới</p>
                        </div>
                        <Button variant="outline" size="sm">Đang phát triển</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              {(selectedTab === 'personal-info') && (
                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => reset()}
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                </div>
              )}
            </Tabs>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
