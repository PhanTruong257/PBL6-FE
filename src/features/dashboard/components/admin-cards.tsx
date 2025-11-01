import { ActivityItem } from './dashboard-items'

export function SystemStatsCard() {
    return (
        <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Thống kê hệ thống</h3>
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm">Người dùng mới (tuần này)</span>
                    <span className="font-semibold">+45</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm">Lớp học mới</span>
                    <span className="font-semibold">+12</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm">Tỷ lệ hoạt động</span>
                    <span className="font-semibold text-green-600">95%</span>
                </div>
            </div>
        </div>
    )
}

export function RecentActivitiesCard() {
    return (
        <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Hoạt động gần đây</h3>
            <div className="space-y-3">
                <ActivityItem
                    title="Người dùng mới đăng ký"
                    description="Nguyễn Văn A đã đăng ký tài khoản"
                    time="5 phút trước"
                />
                <ActivityItem
                    title="Lớp học mới được tạo"
                    description="Lập trình Python cơ bản"
                    time="15 phút trước"
                />
                <ActivityItem
                    title="Bài tập được nộp"
                    description="23 bài tập mới được nộp"
                    time="1 giờ trước"
                />
            </div>
        </div>
    )
}