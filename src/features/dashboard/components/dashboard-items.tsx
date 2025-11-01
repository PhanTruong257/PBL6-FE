interface ActivityItemProps {
    title: string
    description: string
    time: string
}

export function ActivityItem({ title, description, time }: ActivityItemProps) {
    return (
        <div className="p-3 rounded-lg hover:bg-muted/50">
            <p className="font-medium text-sm">{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
            <p className="text-xs text-muted-foreground mt-1">{time}</p>
        </div>
    )
}

interface ClassItemProps {
    name: string
    time: string
    students: number
}

export function ClassItem({ name, time, students }: ClassItemProps) {
    return (
        <div className="p-3 rounded-lg hover:bg-muted/50">
            <p className="font-medium text-sm">{name}</p>
            <p className="text-sm text-muted-foreground">{time}</p>
            <p className="text-xs text-muted-foreground mt-1">{students} học viên</p>
        </div>
    )
}

interface AssignmentItemProps {
    name: string
    pending: number
    total: number
}

export function AssignmentItem({ name, pending, total }: AssignmentItemProps) {
    return (
        <div className="p-3 rounded-lg hover:bg-muted/50">
            <p className="font-medium text-sm">{name}</p>
            <p className="text-sm text-muted-foreground">
                {pending} chưa chấm / {total} bài nộp
            </p>
        </div>
    )
}

interface CourseItemProps {
    icon: string
    name: string
    description: string
    progress: number
}

export function CourseItem({ icon, name, description, progress }: CourseItemProps) {
    return (
        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                {icon}
            </div>
            <div className="flex-1">
                <p className="font-medium">{name}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <div className="text-sm text-muted-foreground">{progress}%</div>
        </div>
    )
}

interface NotificationItemProps {
    type: 'info' | 'success' | 'warning'
    title: string
    description: string
}

export function NotificationItem({ type, title, description }: NotificationItemProps) {
    const colors = {
        info: 'border-blue-500 bg-blue-500/5',
        success: 'border-green-500 bg-green-500/5',
        warning: 'border-orange-500 bg-orange-500/5',
    }

    return (
        <div className={`p-3 rounded-lg border-l-4 ${colors[type]}`}>
            <p className="font-medium text-sm">{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    )
}