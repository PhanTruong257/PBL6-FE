import { useState } from 'react'
import type { ViewMode } from '../types'

export function useCalendarNavigation() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [viewMode, setViewMode] = useState<ViewMode>('week')

    // Get the start of the week (Monday)
    const getWeekStart = (date: Date) => {
        const d = new Date(date)
        const day = d.getDay()
        const diff = d.getDate() - day + (day === 0 ? -6 : 1)
        return new Date(d.setDate(diff))
    }

    // Get the days of the current week
    const getWeekDays = (startDate: Date) => {
        const days = []
        for (let i = 0; i < 7; i++) {
            const day = new Date(startDate)
            day.setDate(startDate.getDate() + i)
            days.push(day)
        }
        return days
    }

    const weekStart = getWeekStart(currentDate)
    const weekDays = getWeekDays(weekStart)

    // Navigate weeks
    const previousWeek = () => {
        const newDate = new Date(currentDate)
        newDate.setDate(currentDate.getDate() - 7)
        setCurrentDate(newDate)
    }

    const nextWeek = () => {
        const newDate = new Date(currentDate)
        newDate.setDate(currentDate.getDate() + 7)
        setCurrentDate(newDate)
    }

    const goToToday = () => {
        setCurrentDate(new Date())
    }

    // Get month and year
    const getMonthYear = () => {
        return currentDate.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        })
    }

    return {
        currentDate,
        viewMode,
        weekDays,
        setViewMode,
        previousWeek,
        nextWeek,
        goToToday,
        getMonthYear
    }
}