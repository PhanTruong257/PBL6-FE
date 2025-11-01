export type ScheduleEvent = {
    id: string
    title: string
    start: string // ISO datetime
    end: string // ISO datetime
    location?: string
    className?: string
    teacher?: string
    type?: 'class' | 'exam' | 'meeting'
}

export const mockScheduleData: ScheduleEvent[] = [
    // Thứ 2 - Monday (2025-11-03)
    {
        id: '1',
        title: 'Lập trình Java nâng cao',
        start: '2025-11-03T07:00:00',
        end: '2025-11-03T09:30:00',
        location: 'Phòng 101',
        className: 'Java Programming',
        teacher: 'TS. Nguyễn Văn Minh',
        type: 'class'
    },
    {
        id: '2',
        title: 'Thực hành Database',
        start: '2025-11-03T10:00:00',
        end: '2025-11-03T11:30:00',
        location: 'Lab 2',
        className: 'Database Systems',
        teacher: 'ThS. Lê Thị Hương',
        type: 'class'
    },
    {
        id: '3',
        title: 'Seminar AI & ML',
        start: '2025-11-03T14:00:00',
        end: '2025-11-03T15:30:00',
        location: 'Hội trường A',
        className: 'AI Research',
        teacher: 'TS. Trần Đức Nam',
        type: 'meeting'
    },

    // Thứ 3 - Tuesday (2025-11-04) 
    {
        id: '4',
        title: 'Thuật toán và cấu trúc dữ liệu',
        start: '2025-11-04T07:00:00',
        end: '2025-11-04T09:30:00',
        location: 'Phòng 201',
        className: 'Algorithm & Data Structure',
        teacher: 'TS. Phạm Minh Tuấn',
        type: 'class'
    },
    {
        id: '5',
        title: 'Họp team PBL6',
        start: '2025-11-04T15:00:00',
        end: '2025-11-04T18:00:00',
        location: 'Phòng họp A',
        className: 'PBL6 Project',
        teacher: 'ThS. Văn Danh',
        type: 'meeting'
    },

    // Thứ 4 - Wednesday (2025-11-05)
    {
        id: '6',
        title: 'Lý thuyết đồ thị',
        start: '2025-11-05T07:00:00',
        end: '2025-11-05T09:30:00',
        location: 'Phòng 201',
        className: 'Graph Theory',
        teacher: 'TS. Nguyễn Minh Tâm',
        type: 'class'
    },
    {
        id: '7',
        title: 'Thực hành Web Development',
        start: '2025-11-05T10:00:00',
        end: '2025-11-05T12:00:00',
        location: 'Lab 3',
        className: 'Web Programming',
        teacher: 'ThS. Ngô Thanh Sơn',
        type: 'class'
    },
    {
        id: '8',
        title: 'Bảo vệ đồ án giữa kỳ',
        start: '2025-11-05T13:30:00',
        end: '2025-11-05T16:30:00',
        location: 'Phòng 301',
        className: 'Software Engineering',
        teacher: 'TS. Võ Đức Hoàng',
        type: 'exam'
    },

    // Thứ 5 - Thursday (2025-11-06)
    {
        id: '9',
        title: 'Mạng máy tính',
        start: '2025-11-06T08:00:00',
        end: '2025-11-06T10:30:00',
        location: 'Phòng 102',
        className: 'Computer Networks',
        teacher: 'TS. Lý Công Định',
        type: 'class'
    },
    {
        id: '10',
        title: 'Kiểm tra phần mềm',
        start: '2025-11-06T12:00:00',
        end: '2025-11-06T14:30:00',
        location: 'Lab 1',
        className: 'Software Testing',
        teacher: 'TS. Võ Đức Hoàng',
        type: 'exam'
    },

    // Thứ 6 - Friday (2025-11-07)
    {
        id: '11',
        title: 'Kiểm tra hướng dẫn sinh viên',
        start: '2025-11-07T08:00:00',
        end: '2025-11-07T10:30:00',
        location: 'Phòng 301',
        className: 'SOA',
        teacher: 'TS. Đặng Hoài Phương',
        type: 'exam'
    },
    {
        id: '12',
        title: 'Thuyết trình đồ án tốt nghiệp',
        start: '2025-11-07T14:00:00',
        end: '2025-11-07T17:00:00',
        location: 'Hội trường B',
        className: 'Graduation Project',
        teacher: 'Hội đồng bảo vệ',
        type: 'exam'
    },

    // Thứ 7 - Saturday (2025-11-08)
    {
        id: '13',
        title: 'Thực hành Machine Learning',
        start: '2025-11-08T08:00:00',
        end: '2025-11-08T11:00:00',
        location: 'Lab ML',
        className: 'ML Advanced',
        teacher: 'TS. Lê Hoàng Nam',
        type: 'class'
    },
    {
        id: '14',
        title: 'Workshop ReactJS',
        start: '2025-11-08T13:00:00',
        end: '2025-11-08T16:00:00',
        location: 'Lab 4',
        className: 'Frontend Development',
        teacher: 'ThS. Nguyễn Hoàng Long',
        type: 'class'
    },

    // Chủ nhật - Sunday (2025-11-09)
    {
        id: '15',
        title: 'Ôn tập cuối kỳ',
        start: '2025-11-09T09:00:00',
        end: '2025-11-09T12:00:00',
        location: 'Phòng tự học 1',
        className: 'Self Study',
        teacher: 'Tự học nhóm',
        type: 'meeting'
    }
]