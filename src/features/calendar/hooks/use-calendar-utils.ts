import type { ScheduleEvent, EventStyle, DateInfo } from '../types'

export function useCalendarUtils() {
  // Generate time slots (7:00 to 18:00) - typical school/work hours
  const timeSlots: string[] = []
  for (let hour = 7; hour <= 18; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`)
  }

  // Calculate event position and height based on duration
  const getEventStyle = (event: ScheduleEvent): EventStyle => {
    const start = new Date(event.start)
    const end = new Date(event.end)

    // Validate dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.warn('Invalid event dates:', event)
      return {
        top: '0px',
        height: '64px', // Default 1 hour height
      }
    }

    // Use UTC hours to avoid timezone conversion issues
    // Server stores time in local timezone but without timezone info
    const startMinutes = start.getUTCHours() * 60 + start.getUTCMinutes()
    const duration = (end.getTime() - start.getTime()) / (1000 * 60) // duration in minutes

    // Clamp duration to reasonable values (min 30 min, max 8 hours)
    const clampedDuration = Math.min(Math.max(duration, 30), 480)

    const startOffset = ((startMinutes - 7 * 60) / 60) * 64 // 64px per hour, starting from 7:00
    const height = (clampedDuration / 60) * 64 // 64px per hour

    return {
      top: `${Math.max(startOffset, 0)}px`,
      height: `${Math.max(height, 40)}px`, // minimum height 40px
    }
  }

  // Get event color based on type and isTeacherExam
  const getEventColor = (type: string = 'class', isTeacherExam?: boolean) => {
    switch (type) {
      case 'exam':
        // Teacher's exam (created by them) - orange color
        // Student's exam (assigned to them) - red color
        if (isTeacherExam === true) {
          return 'bg-orange-50 border-l-orange-500 text-orange-900'
        }
        return 'bg-red-50 border-l-red-500 text-red-900'
      case 'meeting':
        return 'bg-green-50 border-l-green-500 text-green-900'
      case 'class':
      default:
        return 'bg-blue-50 border-l-blue-500 text-blue-900'
    }
  }

  // Format date for display
  const formatDate = (date: Date): DateInfo => {
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()

    return {
      day: date.getDate().toString(),
      weekday: date.toLocaleDateString('en-US', { weekday: 'long' }),
      isToday,
    }
  }

  // Format time display - use UTC to match server time
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const hours = date.getUTCHours().toString().padStart(2, '0')
    const minutes = date.getUTCMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  // Filter events for a specific day
  const getEventsForDay = (
    events: ScheduleEvent[],
    date: Date,
  ): ScheduleEvent[] => {
    const dayStr = date.toISOString().split('T')[0]
    return events.filter((event: ScheduleEvent) => {
      const eventDate = new Date(event.start).toISOString().split('T')[0]
      return eventDate === dayStr
    })
  }

  return {
    timeSlots,
    getEventStyle,
    getEventColor,
    formatDate,
    formatTime,
    getEventsForDay,
  }
}
