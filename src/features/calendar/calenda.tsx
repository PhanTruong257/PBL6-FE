import { cn } from '@/libs/utils/cn'
import { mockScheduleData } from './mock-data'
import { useCalendarNavigation, useCalendarUtils } from './hooks'
import { CalendarHeader, CalendarGrid } from './components'

interface CalendarProps {
    className?: string
}

export function Calendar({ className }: CalendarProps) {
    const {
        viewMode,
        weekDays,
        setViewMode,
        previousWeek,
        nextWeek,
        goToToday,
        getMonthYear
    } = useCalendarNavigation()

    const {
        timeSlots,
        getEventStyle,
        getEventColor,
        formatDate,
        formatTime,
        getEventsForDay
    } = useCalendarUtils()

    return (
        <div className={cn("flex h-screen flex-col bg-background", className)}>
            <CalendarHeader
                monthYear={getMonthYear()}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onPreviousWeek={previousWeek}
                onNextWeek={nextWeek}
                onGoToToday={goToToday}
            />




            <CalendarGrid
                weekDays={weekDays}
                timeSlots={timeSlots}
                events={mockScheduleData}
                getEventStyle={getEventStyle}
                getEventColor={getEventColor}
                formatDate={formatDate}
                formatTime={formatTime}
                getEventsForDay={getEventsForDay}
            />
        </div>
    )
}


