import { ScrollArea } from '@/components/ui/scroll-area'
import { TimeColumn } from './time-column'
import { DayColumn } from './day-column'
import type { ScheduleEvent } from '../types'

interface CalendarGridProps {
    weekDays: Date[]
    timeSlots: string[]
    events: ScheduleEvent[]
    getEventStyle: (event: ScheduleEvent) => { top: string; height: string }
    getEventColor: (type?: string) => string
    formatDate: (date: Date) => { day: string; weekday: string; isToday: boolean }
    formatTime: (dateStr: string) => string
    getEventsForDay: (events: ScheduleEvent[], date: Date) => ScheduleEvent[]
}

export function CalendarGrid({
    weekDays,
    timeSlots,
    events,
    getEventStyle,
    getEventColor,
    formatDate,
    formatTime,
    getEventsForDay
}: CalendarGridProps) {
    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Days headers */}
            <div className="flex border-b">
                {/* Empty space for time column */}
                <div className="w-16 h-16 border-r bg-background"></div>

                {/* Day headers */}
                {weekDays.map((day, dayIndex) => {
                    const dateInfo = formatDate(day)
                    return (
                        <div key={dayIndex} className="flex-1 h-16 border-r flex flex-col items-center justify-center bg-background last:border-r-0">
                            <div className="text-xs text-muted-foreground uppercase font-medium mb-1">
                                {dateInfo.weekday}
                            </div>
                            <div className={
                                dateInfo.isToday ?
                                    "bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium" :
                                    "text-xl font-normal text-foreground"
                            }>
                                {dateInfo.day}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Scrollable content */}
            <ScrollArea className="flex-1 h-full">
                <div className="flex min-h-full">
                    {/* Time column */}
                    <TimeColumn timeSlots={timeSlots} />

                    {/* Days content */}
                    <div className="flex-1 grid grid-cols-7 min-h-full">
                        {weekDays.map((day, dayIndex) => {
                            const dayEvents = getEventsForDay(events, day)

                            return (
                                <DayColumn
                                    key={dayIndex}
                                    day={day}
                                    timeSlots={timeSlots}
                                    events={dayEvents}
                                    getEventStyle={getEventStyle}
                                    getEventColor={getEventColor}
                                    formatTime={formatTime}
                                />
                            )
                        })}
                    </div>
                </div>
                {/* Spacer to ensure scroll to bottom */}
                <div className="h-20"></div>
            </ScrollArea>
        </div>
    )
}