import { EventCard } from './event-card'
import type { ScheduleEvent } from '../types'

interface DayColumnProps {
  day: Date
  timeSlots: string[]
  events: ScheduleEvent[]
  getEventStyle: (event: ScheduleEvent) => { top: string; height: string }
  getEventColor: (type?: string, isTeacherExam?: boolean) => string
  formatTime: (dateStr: string) => string
}

export function DayColumn({
  timeSlots,
  events,
  getEventStyle,
  getEventColor,
  formatTime,
}: DayColumnProps) {
  return (
    <div className="border-r relative last:border-r-0">
      <div className="relative">
        {/* Grid lines */}
        {timeSlots.map((_, timeIndex) => (
          <div key={timeIndex} className="h-16 border-b border-border/10"></div>
        ))}

        {/* Events */}
        {events.map((event: ScheduleEvent) => {
          const style = getEventStyle(event)
          const colorClass = getEventColor(event.type, event.isTeacherExam)

          return (
            <EventCard
              key={event.id}
              event={event}
              style={style}
              colorClass={colorClass}
              formatTime={formatTime}
            />
          )
        })}
      </div>
    </div>
  )
}
