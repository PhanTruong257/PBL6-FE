import { cn } from '@/libs/utils/cn'
import {
  useCalendarNavigation,
  useCalendarUtils,
  useCalendarExams,
} from './hooks'
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
    getMonthYear,
  } = useCalendarNavigation()

  const {
    timeSlots,
    getEventStyle,
    getEventColor,
    formatDate,
    formatTime,
    getEventsForDay,
  } = useCalendarUtils()

  const { events, isLoading } = useCalendarExams()

  return (
    <div className={cn('flex h-full flex-col bg-background', className)}>
      <CalendarHeader
        monthYear={getMonthYear()}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onPreviousWeek={previousWeek}
        onNextWeek={nextWeek}
        onGoToToday={goToToday}
      />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Đang tải...</div>
        </div>
      ) : (
        <CalendarGrid
          weekDays={weekDays}
          timeSlots={timeSlots}
          events={events}
          getEventStyle={getEventStyle}
          getEventColor={getEventColor}
          formatDate={formatDate}
          formatTime={formatTime}
          getEventsForDay={getEventsForDay}
        />
      )}
    </div>
  )
}
