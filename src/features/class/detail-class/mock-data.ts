import type { ClassBasicInfo } from '@/types/class'
import type { PostCardProps } from './types'
import type { User } from '@/types'

export const mockUser: User = {
    user_id: 1,
    full_name: 'Thầy Nguyễn Văn Minh',
    role: 'teacher',
    email: "teacher@gmail.com",
    isEmailVerified: true,
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
}

export const mockStudent: User = {
    user_id: 2,
    full_name: 'Sinh viên Phạm Minh Tuấn',
    role: 'user',
    email: "student@gmail.com",
    isEmailVerified: true,
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
}

export const mockClassInfo: ClassBasicInfo = {
    class_id: 1,
    class_name: 'Lập trình hướng đối tượng',
    class_code: 'CS101',
    teacher_id: 1,
    description: 'Lớp học về lập trình hướng đối tượng với Java và C++',
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
}

export const mockPostData: PostCardProps[] = [
    {
        id: 1,
        sender: mockUser,
        title: 'Thông báo',
        message: 'Chào các em! Hôm nay chúng ta sẽ học về khái niệm Class và Object trong lập trình hướng đối tượng. Các em hãy đọc trước tài liệu tôi đã gửi.',
        created_at: new Date('2024-11-01T08:00:00'),
        replies: [
            {
                id: 2,
                sender: mockStudent,
                title: '',
                message: 'Thầy ơi, em có thể tìm tài liệu ở đâu ạ?',
                created_at: new Date('2024-11-01T08:30:00'),
                replies: []
            },
            {
                id: 3,
                sender: mockUser,
                title: '',
                message: 'Em vào phần tài liệu của lớp học, thầy đã upload file PDF.',
                created_at: new Date('2024-11-01T08:35:00'),
                replies: []
            }
        ]
    },
    {
        id: 4,
        sender: mockUser,
        title: 'Thông báo',
        message: 'Bài tập về nhà: Thiết kế class Student với các thuộc tính: name, studentId, email và các method: study(), takeExam(). Deadline: 05/11/2024',
        created_at: new Date('2024-11-01T10:00:00'),
        replies: [
            {
                id: 5,
                sender: mockStudent,
                title: '',
                message: 'Thầy ơi, em nộp bài ở đâu ạ?',
                created_at: new Date('2024-11-01T11:00:00'),
                replies: []
            }
        ]
    },
    {
        id: 6,
        sender: mockStudent,
        title: 'Thông báo',
        message: 'Thầy ơi, em có câu hỏi về inheritance. Khi nào thì nên sử dụng ạ?',
        created_at: new Date('2024-11-01T14:00:00'),
        replies: [
            {
                id: 7,
                sender: mockUser,
                title: '',
                message: 'Câu hỏi hay! Inheritance được sử dụng khi có mối quan hệ "is-a" giữa các class. Ví dụ: Dog is-a Animal.',
                created_at: new Date('2024-11-01T14:15:00'),
                replies: []
            },
            {
                id: 8,
                sender: mockStudent,
                title: '',
                message: 'Em hiểu rồi ạ! Cảm ơn thầy.',
                created_at: new Date('2024-11-01T14:20:00'),
                replies: []
            }
        ]
    }
]

export const mockClassDetail = {
    classInfo: mockClassInfo,
    formattedPostData: mockPostData
}