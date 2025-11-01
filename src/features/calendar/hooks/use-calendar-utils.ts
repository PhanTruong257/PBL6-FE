import type { ScheduleEvent, EventStyle, DateInfo } from '../types'

export function useCalendarUtils() {
    // Generate time slots (6:00 to 22:00)
    const timeSlots: string[] = []
    for (let hour = 6; hour <= 22; hour++) {
        timeSlots.push(`${hour.toString().padStart(2, '0')}:00`)
    }

    // Calculate event position and height based on duration
    const getEventStyle = (event: ScheduleEvent): EventStyle => {
        const start = new Date(event.start)
        const end = new Date(event.end)
        const startMinutes = start.getHours() * 60 + start.getMinutes()
        const duration = (end.getTime() - start.getTime()) / (1000 * 60) // duration in minutes

        const startOffset = ((startMinutes - 6 * 60) / 60) * 64 // 64px per hour, starting from 6:00
        const height = (duration / 60) * 64 // 64px per hour

        return {
            top: `${Math.max(startOffset, 0)}px`,
            height: `${Math.max(height, 40)}px`, // minimum height 40px
        }
    }

    // Get event color based on type
    const getEventColor = (type: string = 'class') => {
        switch (type) {
            case 'exam':
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
            isToday
        }
    }

    // Format time display
    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })
    }

    // Filter events for a specific day
    const getEventsForDay = (events: ScheduleEvent[], date: Date): ScheduleEvent[] => {
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
        getEventsForDay
    }
}