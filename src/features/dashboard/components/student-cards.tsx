import { CourseItem, NotificationItem } from './dashboard-items'

export function RecentCoursesCard() {
    return (
        <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Khóa học gần đây</h3>
            <div className="space-y-3">
                <CourseItem
                    icon="💻"
                    name="Lập trình Web Frontend"
                    description="React, TypeScript"
                    progress={85}
                />
                <CourseItem
                    icon="🗃️"
                    name="Cơ sở dữ liệu"
                    description="MySQL, MongoDB"
                    progress={92}
                />
                <CourseItem
                    icon="🎨"
                    name="UI/UX Design"
                    description="Figma, Design System"
                    progress={67}
                />
            </div>
        </div>
    )
}

export function NotificationsCard() {
    return (
        <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Thông báo mới</h3>
            <div className="space-y-3">
                <NotificationItem
                    type="info"
                    title="Bài tập mới đã được giao"
                    description="Lập trình Web Frontend - Deadline: 25/12/2024"
                />
                <NotificationItem
                    type="success"
                    title="Điểm kiểm tra đã có"
                    description="Cơ sở dữ liệu - Điểm: 9.2/10"
                />
                <NotificationItem
                    type="warning"
                    title="Lịch học thay đổi"
                    description="UI/UX Design - Chuyển sang thứ 5 tuần sau"
                />
            </div>
        </div>
    )
}