import { ClassItem, AssignmentItem } from './dashboard-items'

export function UpcomingClassesCard() {
    return (
        <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Lớp học sắp tới</h3>
            <div className="space-y-3">
                <ClassItem
                    name="Lập trình Web Frontend"
                    time="Thứ 2, 14:00 - 16:00"
                    students={45}
                />
                <ClassItem name="Cơ sở dữ liệu" time="Thứ 4, 09:00 - 11:00" students={38} />
                <ClassItem name="UI/UX Design" time="Thứ 6, 15:00 - 17:00" students={25} />
            </div>
        </div>
    )
}

export function PendingAssignmentsCard() {
    return (
        <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Bài tập cần chấm</h3>
            <div className="space-y-3">
                <AssignmentItem name="Bài tập React Hooks" pending={12} total={45} />
                <AssignmentItem name="Thiết kế Database" pending={8} total={38} />
                <AssignmentItem name="Prototype Design" pending={3} total={25} />
            </div>
        </div>
    )
}