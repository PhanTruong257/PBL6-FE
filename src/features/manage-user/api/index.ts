import type { Teacher } from '../types'

// Mock data for teachers
export const mockTeachers: Teacher[] = [
  {
    user_id: 1,
    teacher_id: 'T001',
    full_name: 'Nguyễn Văn An',
    email: 'nguyenvanan@example.com',
    phone: '0901234567',
    address: 'Hà Nội',
    role: 'teacher',
    status: 'active',
    department: 'Khoa học máy tính',
    specialization: 'Trí tuệ nhân tạo',
    qualification: 'Tiến sĩ',
    experience_years: 10,
    bio: 'Giảng viên có 10 năm kinh nghiệm trong lĩnh vực AI và Machine Learning',
    courses_taught: 15,
    rating: 4.8,
    is_verified: true,
    created_at: '2023-01-15T08:00:00Z',
    updated_at: '2024-10-01T10:30:00Z',
  },
  {
    user_id: 2,
    teacher_id: 'T002',
    full_name: 'Trần Thị Bình',
    email: 'tranthibinh@example.com',
    phone: '0909876543',
    address: 'TP.HCM',
    role: 'teacher',
    status: 'active',
    department: 'Toán học',
    specialization: 'Đại số',
    qualification: 'Thạc sĩ',
    experience_years: 7,
    bio: 'Chuyên gia về đại số và lý thuyết số',
    courses_taught: 12,
    rating: 4.6,
    is_verified: true,
    created_at: '2023-02-20T09:15:00Z',
    updated_at: '2024-09-15T14:20:00Z',
  },
  {
    user_id: 3,
    teacher_id: 'T003',
    full_name: 'Lê Minh Cường',
    email: 'leminhcuong@example.com',
    phone: '0912345678',
    address: 'Đà Nẵng',
    role: 'teacher',
    status: 'inactive',
    department: 'Vật lý',
    specialization: 'Vật lý lượng tử',
    qualification: 'Tiến sĩ',
    experience_years: 15,
    bio: 'Nghiên cứu viên về vật lý lượng tử và quang học',
    courses_taught: 20,
    rating: 4.9,
    is_verified: true,
    created_at: '2022-11-10T07:45:00Z',
    updated_at: '2024-08-30T16:10:00Z',
  },
  {
    user_id: 4,
    teacher_id: 'T004',
    full_name: 'Phạm Thị Dung',
    email: 'phamthidung@example.com',
    phone: '0923456789',
    address: 'Hải Phòng',
    role: 'teacher',
    status: 'pending',
    department: 'Hóa học',
    specialization: 'Hóa hữu cơ',
    qualification: 'Thạc sĩ',
    experience_years: 5,
    bio: 'Chuyên gia về hóa hữu cơ và sinh hóa',
    courses_taught: 8,
    rating: 4.4,
    is_verified: false,
    created_at: '2024-03-05T11:20:00Z',
    updated_at: '2024-10-05T09:30:00Z',
  },
  {
    user_id: 5,
    teacher_id: 'T005',
    full_name: 'Hoàng Văn Em',
    email: 'hoangvanem@example.com',
    phone: '0934567890',
    address: 'Cần Thơ',
    role: 'teacher',
    status: 'suspended',
    department: 'Sinh học',
    specialization: 'Sinh học phân tử',
    qualification: 'Tiến sĩ',
    experience_years: 12,
    bio: 'Nghiên cứu về sinh học phân tử và di truyền học',
    courses_taught: 18,
    rating: 4.2,
    is_verified: true,
    created_at: '2022-08-18T13:40:00Z',
    updated_at: '2024-07-22T11:45:00Z',
  },
  {
    user_id: 6,
    teacher_id: 'T006',
    full_name: 'Nguyễn Thị Linh',
    email: 'nguyenthilinh@example.com',
    phone: '0945678901',
    address: 'Huế',
    role: 'teacher',
    status: 'active',
    department: 'Ngôn ngữ Anh',
    specialization: 'Ngôn ngữ học',
    qualification: 'Thạc sĩ',
    experience_years: 8,
    bio: 'Giảng viên chuyên về ngôn ngữ Anh và văn hóa',
    courses_taught: 14,
    rating: 4.7,
    is_verified: true,
    created_at: '2023-05-10T10:00:00Z',
    updated_at: '2024-09-20T12:00:00Z',
  },
  {
    user_id: 7,
    teacher_id: 'T007',
    full_name: 'Trần Văn Giang',
    email: 'tranvangi@example.com',
    phone: '0956789012',
    address: 'Nha Trang',
    role: 'teacher',
    status: 'active',
    department: 'Kinh tế',
    specialization: 'Kinh tế vĩ mô',
    qualification: 'Tiến sĩ',
    experience_years: 12,
    bio: 'Chuyên gia kinh tế với kinh nghiệm nghiên cứu thị trường',
    courses_taught: 16,
    rating: 4.5,
    is_verified: true,
    created_at: '2022-12-01T08:30:00Z',
    updated_at: '2024-08-15T15:45:00Z',
  },
  {
    user_id: 8,
    teacher_id: 'T008',
    full_name: 'Lê Thị Hoa',
    email: 'lethihoa@example.com',
    phone: '0967890123',
    address: 'Vũng Tàu',
    role: 'teacher',
    status: 'inactive',
    department: 'Lịch sử',
    specialization: 'Lịch sử Việt Nam',
    qualification: 'Thạc sĩ',
    experience_years: 9,
    bio: 'Giảng viên lịch sử với đam mê nghiên cứu văn hóa',
    courses_taught: 11,
    rating: 4.3,
    is_verified: false,
    created_at: '2023-07-22T14:20:00Z',
    updated_at: '2024-07-10T09:15:00Z',
  },
  {
    user_id: 9,
    teacher_id: 'T009',
    full_name: 'Phạm Văn Huy',
    email: 'phamvanhuy@example.com',
    phone: '0978901234',
    address: 'Quảng Ninh',
    role: 'teacher',
    status: 'pending',
    department: 'Địa lý',
    specialization: 'Địa lý tự nhiên',
    qualification: 'Tiến sĩ',
    experience_years: 6,
    bio: 'Nghiên cứu viên về địa lý và môi trường',
    courses_taught: 9,
    rating: 4.1,
    is_verified: false,
    created_at: '2024-01-18T11:45:00Z',
    updated_at: '2024-10-10T13:30:00Z',
  },
  {
    user_id: 10,
    teacher_id: 'T010',
    full_name: 'Hoàng Thị Mai',
    email: 'hoangthimai@example.com',
    phone: '0989012345',
    address: 'Bình Dương',
    role: 'teacher',
    status: 'active',
    department: 'Giáo dục',
    specialization: 'Phương pháp giảng dạy',
    qualification: 'Thạc sĩ',
    experience_years: 11,
    bio: 'Chuyên gia về phương pháp giảng dạy hiện đại',
    courses_taught: 17,
    rating: 4.8,
    is_verified: true,
    created_at: '2022-09-05T07:00:00Z',
    updated_at: '2024-09-05T16:20:00Z',
  },
  {
    user_id: 11,
    teacher_id: 'T011',
    full_name: 'Đỗ Văn Nam',
    email: 'dovannam@example.com',
    phone: '0990123456',
    address: 'Đồng Nai',
    role: 'teacher',
    status: 'suspended',
    department: 'Kỹ thuật',
    specialization: 'Kỹ thuật điện',
    qualification: 'Tiến sĩ',
    experience_years: 14,
    bio: 'Kỹ sư điện với kinh nghiệm công nghiệp',
    courses_taught: 19,
    rating: 4.0,
    is_verified: true,
    created_at: '2022-06-12T12:15:00Z',
    updated_at: '2024-06-30T10:45:00Z',
  },
  {
    user_id: 12,
    teacher_id: 'T012',
    full_name: 'Bùi Thị Oanh',
    email: 'buithioanh@example.com',
    phone: '0911234567',
    address: 'Thái Nguyên',
    role: 'teacher',
    status: 'active',
    department: 'Nghệ thuật',
    specialization: 'Âm nhạc',
    qualification: 'Thạc sĩ',
    experience_years: 7,
    bio: 'Giảng viên âm nhạc và biểu diễn nghệ thuật',
    courses_taught: 10,
    rating: 4.6,
    is_verified: true,
    created_at: '2023-03-28T09:30:00Z',
    updated_at: '2024-08-25T14:10:00Z',
  },
  {
    user_id: 13,
    teacher_id: 'T013',
    full_name: 'Ngô Văn Phong',
    email: 'ngovanphong@example.com',
    phone: '0922345678',
    address: 'Hà Tĩnh',
    role: 'teacher',
    status: 'active',
    department: 'Triết học',
    specialization: 'Triết học Đông phương',
    qualification: 'Tiến sĩ',
    experience_years: 16,
    bio: 'Nghiên cứu viên triết học với nhiều xuất bản',
    courses_taught: 22,
    rating: 4.9,
    is_verified: true,
    created_at: '2022-04-15T06:45:00Z',
    updated_at: '2024-07-18T11:00:00Z',
  },
  {
    user_id: 14,
    teacher_id: 'T014',
    full_name: 'Vũ Thị Quỳnh',
    email: 'vuthiquynh@example.com',
    phone: '0933456789',
    address: 'Bắc Ninh',
    role: 'teacher',
    status: 'pending',
    department: 'Y học',
    specialization: 'Y tế công cộng',
    qualification: 'Thạc sĩ',
    experience_years: 4,
    bio: 'Chuyên gia y tế với nền tảng nghiên cứu',
    courses_taught: 6,
    rating: 4.2,
    is_verified: false,
    created_at: '2024-02-14T13:20:00Z',
    updated_at: '2024-10-12T08:50:00Z',
  },
  {
    user_id: 15,
    teacher_id: 'T015',
    full_name: 'Đinh Văn Sơn',
    email: 'dinhvanson@example.com',
    phone: '0944567890',
    address: 'Nam Định',
    role: 'teacher',
    status: 'inactive',
    department: 'Luật học',
    specialization: 'Luật dân sự',
    qualification: 'Tiến sĩ',
    experience_years: 13,
    bio: 'Luật sư và giảng viên luật với kinh nghiệm tư vấn',
    courses_taught: 15,
    rating: 4.4,
    is_verified: true,
    created_at: '2022-10-30T15:10:00Z',
    updated_at: '2024-05-22T17:30:00Z',
  },
  {
    user_id: 16,
    teacher_id: 'T016',
    full_name: 'Trương Thị Trang',
    email: 'truongthitrang@example.com',
    phone: '0955678901',
    address: 'Thanh Hóa',
    role: 'teacher',
    status: 'active',
    department: 'Tâm lý học',
    specialization: 'Tâm lý học giáo dục',
    qualification: 'Thạc sĩ',
    experience_years: 9,
    bio: 'Chuyên gia tâm lý với focus vào giáo dục',
    courses_taught: 13,
    rating: 4.7,
    is_verified: true,
    created_at: '2023-08-09T10:25:00Z',
    updated_at: '2024-09-10T12:40:00Z',
  },
  {
    user_id: 17,
    teacher_id: 'T017',
    full_name: 'Lý Văn Tùng',
    email: 'lyvantung@example.com',
    phone: '0966789012',
    address: 'Ninh Bình',
    role: 'teacher',
    status: 'active',
    department: 'Môi trường',
    specialization: 'Quản lý môi trường',
    qualification: 'Tiến sĩ',
    experience_years: 11,
    bio: 'Nghiên cứu viên về bảo vệ môi trường',
    courses_taught: 14,
    rating: 4.5,
    is_verified: true,
    created_at: '2022-11-25T14:50:00Z',
    updated_at: '2024-08-05T09:20:00Z',
  },
  {
    user_id: 18,
    teacher_id: 'T018',
    full_name: 'Mai Thị Uyên',
    email: 'maithuyen@example.com',
    phone: '0977890123',
    address: 'Phú Thọ',
    role: 'teacher',
    status: 'suspended',
    department: 'Thể dục',
    specialization: 'Giáo dục thể chất',
    qualification: 'Thạc sĩ',
    experience_years: 8,
    bio: 'Huấn luyện viên thể dục với kinh nghiệm đào tạo',
    courses_taught: 12,
    rating: 4.1,
    is_verified: false,
    created_at: '2023-04-03T11:35:00Z',
    updated_at: '2024-06-15T13:55:00Z',
  },
  {
    user_id: 19,
    teacher_id: 'T019',
    full_name: 'Nguyễn Văn Vinh',
    email: 'nguyenvanvinh@example.com',
    phone: '0988901234',
    address: 'Hà Giang',
    role: 'teacher',
    status: 'active',
    department: 'Nông nghiệp',
    specialization: 'Khoa học cây trồng',
    qualification: 'Tiến sĩ',
    experience_years: 17,
    bio: 'Chuyên gia nông nghiệp với nghiên cứu thực địa',
    courses_taught: 21,
    rating: 4.8,
    is_verified: true,
    created_at: '2022-01-20T08:10:00Z',
    updated_at: '2024-07-30T15:25:00Z',
  },
  {
    user_id: 20,
    teacher_id: 'T020',
    full_name: 'Phan Thị Xuân',
    email: 'phanthixuan@example.com',
    phone: '0999012345',
    address: 'Lào Cai',
    role: 'teacher',
    status: 'pending',
    department: 'Du lịch',
    specialization: 'Quản lý du lịch',
    qualification: 'Thạc sĩ',
    experience_years: 5,
    bio: 'Chuyên gia du lịch với kinh nghiệm quốc tế',
    courses_taught: 7,
    rating: 4.3,
    is_verified: false,
    created_at: '2024-04-22T12:40:00Z',
    updated_at: '2024-10-14T10:15:00Z',
  }
]

// Mock API functions
export const getTeachers = async (filters?: any) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  let filteredTeachers = [...mockTeachers]
  
  if (filters?.search) {
    filteredTeachers = filteredTeachers.filter(teacher =>
      teacher.full_name.toLowerCase().includes(filters.search.toLowerCase()) ||
      teacher.email.toLowerCase().includes(filters.search.toLowerCase())
    )
  }
  
  if (filters?.department) {
    filteredTeachers = filteredTeachers.filter(teacher =>
      teacher.department === filters.department
    )
  }
  
  if (filters?.status) {
    filteredTeachers = filteredTeachers.filter(teacher =>
      teacher.status === filters.status
    )
  }
  
  return {
    data: filteredTeachers,
    total: filteredTeachers.length,
    page: 1,
    limit: 10
  }
}

export const getTeacher = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const teacher = mockTeachers.find(t => t.teacher_id === id)
  if (!teacher) {
    throw new Error('Teacher not found')
  }
  return { data: teacher }
}

export const createTeacher = async (data: any) => {
  await new Promise(resolve => setTimeout(resolve, 800))
  const newTeacher: Teacher = {
    ...data,
    user_id: mockTeachers.length + 1,
    teacher_id: `T${String(mockTeachers.length + 1).padStart(3, '0')}`,
    role: 'teacher' as const,
    status: 'pending' as const,
    courses_taught: 0,
    rating: 0,
    is_verified: false,
    created_at: new Date().toISOString(),
  }
  mockTeachers.push(newTeacher)
  return { data: newTeacher }
}

export const updateTeacher = async (id: string, data: any) => {
  await new Promise(resolve => setTimeout(resolve, 600))
  const index = mockTeachers.findIndex(t => t.teacher_id === id)
  if (index === -1) {
    throw new Error('Teacher not found')
  }
  mockTeachers[index] = { ...mockTeachers[index], ...data, updated_at: new Date().toISOString() }
  return { data: mockTeachers[index] }
}

export const deleteUser = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 400))
  const index = mockTeachers.findIndex(t => t.user_id === parseInt(id))
  if (index === -1) {
    throw new Error('User not found')
  }
  mockTeachers.splice(index, 1)
  return { success: true }
}

// Legacy export for backward compatibility
export const deleteTeacher = deleteUser
