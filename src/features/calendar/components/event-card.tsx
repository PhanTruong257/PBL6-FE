import { cn } from '@/libs/utils/cn'
import type { ScheduleEvent } from '../types'

interface EventCardProps {
    event: ScheduleEvent
    style: { top: string; height: string }
    colorClass: string
    formatTime: (dateStr: string) => string
}

export function EventCard({ event, style, colorClass, formatTime }: EventCardProps) {
    return (
        <div
            className={cn(
                "absolute left-1 right-1 border-l-4 rounded-r-md px-2 py-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer z-10 overflow-hidden",
                colorClass
            )}
            style={style}
        >
            <div className="text-xs font-semibold leading-tight mb-1 truncate">
                {event.title}
            </div>
            <div className="text-xs opacity-80 leading-tight truncate mb-1">
                {formatTime(event.start)} - {formatTime(event.end)}
            </div>
            <div className="text-xs opacity-70 leading-tight truncate">
                {event.teacher}
            </div>
        </div>
    )
}