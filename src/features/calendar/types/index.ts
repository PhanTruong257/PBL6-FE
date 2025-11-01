export type ScheduleEvent = {
    id: string
    title: string
    start: string // ISO datetime
    end: string // ISO datetime
    location?: string
    className?: string
    teacher?: string
    type?: 'class' | 'exam' | 'meeting'
}

export type ViewMode = 'day' | 'week' | 'month'

export type DateInfo = {
    day: string
    weekday: string
    isToday: boolean
}

export type EventStyle = {
    top: string
    height: string
}