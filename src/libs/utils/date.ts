/**
 * Date formatting and manipulation utilities using date-fns
 */
type DateInput = Date | string | number

interface FormatOptions {
  locale?: string
  timeZone?: string
}

const DEFAULT_LOCALE = 'vi-VN'

/**
 * Validates and converts input to Date object
 * @param date - Date input to validate
 * @returns Valid Date object
 * @throws Error if date is invalid
 * @example
 * const date = toDate('2024-01-15')
 * Returns: Date object for 2024-01-15
 * 
 * const date = toDate(1705276800000)
 * Returns: Date object from timestamp (Date object for 2024-01-15T00:00:00.000Z)
 */
export function toDate(date: DateInput): Date {
  const d = new Date(date)
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date provided')
  }
  return d
}

/**
 * Format date to readable string
 * @param date - Date to format
 * @param options - Formatting options (locale, timeZone)
 * @returns Formatted date string
 * @example
 * formatDate(new Date('2024-01-15'))
 * Returns: "15 tháng 1, 2024" (with vi-VN locale)
 * 
 * formatDate(new Date('2024-01-15'), { locale: 'en-US' })
 * Returns: "January 15, 2024"
 * 
 * formatDate('2024-01-15', { timeZone: 'America/New_York' })
 * Returns: Date formatted in New York timezone
 */
export function formatDate(
  date: DateInput,
  options: FormatOptions = {}
): string {
  const { locale = DEFAULT_LOCALE, timeZone } = options
  const d = toDate(date)
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone,
  }).format(d)
}

/**
 * Format date with time
 * @param date - Date to format
 * @param options - Formatting options (locale, timeZone)
 * @returns Formatted date and time string
 * @example
 * formatDateTime(new Date('2024-01-15T14:30:00'))
 * Returns: "15 tháng 1, 2024 lúc 14:30" (with vi-VN locale)
 * 
 * formatDateTime(new Date('2024-01-15T14:30:00'), { locale: 'en-US' })
 * Returns: "January 15, 2024 at 2:30 PM"
 */
export function formatDateTime(
  date: DateInput,
  options: FormatOptions = {}
): string {
  const { locale = DEFAULT_LOCALE, timeZone } = options
  const d = toDate(date)
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
  }).format(d)
}

/**
 * Format time only
 * @param date - Date to extract time from
 * @param options - Formatting options (locale, timeZone)
 * @returns Formatted time string
 * @example
 * formatTime(new Date('2024-01-15T14:30:00'))
 * Returns: "14:30" (with vi-VN locale)
 * 
 * formatTime(new Date('2024-01-15T14:30:00'), { locale: 'en-US' })
 * Returns: "2:30 PM"
 */
export function formatTime(
  date: DateInput,
  options: FormatOptions = {}
): string {
  const { locale = DEFAULT_LOCALE, timeZone } = options
  const d = toDate(date)
  
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
  }).format(d)
}

/**
 * Get relative time string (e.g., "2 hours ago")
 * @param date - Date to compare with current time
 * @param locale - Locale for relative time text (default: vi-VN)
 * @returns Relative time string
 * @example
 * Assuming current time is 2024-01-15 15:00:00
 * getRelativeTime(new Date('2024-01-15 14:30:00'))
 * Returns: "30 phút trước"
 * 
 * getRelativeTime(new Date('2024-01-15 13:00:00'))
 * Returns: "2 giờ trước"
 * 
 * getRelativeTime(new Date('2024-01-10'))
 * Returns: "5 ngày trước"
 * 
 * getRelativeTime(new Date('2023-12-01'))
 * Returns: "1 tháng 12, 2023" (falls back to full date)
 */
export function getRelativeTime(
  date: DateInput,
  locale: string = DEFAULT_LOCALE
): string {
  const d = toDate(date)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)
  
  const isVietnamese = locale.startsWith('vi')
  
  if (diffInSeconds < 60) return isVietnamese ? 'Vừa xong' : 'Just now'
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return isVietnamese ? `${minutes} phút trước` : `${minutes} minutes ago`
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return isVietnamese ? `${hours} giờ trước` : `${hours} hours ago`
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return isVietnamese ? `${days} ngày trước` : `${days} days ago`
  }
  if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800)
    return isVietnamese ? `${weeks} tuần trước` : `${weeks} weeks ago`
  }
  
  return formatDate(d, { locale })
}

/**
 * Check if date is today
 * @param date - Date to check
 * @returns True if date is today
 * @example
 * Assuming today is 2024-01-15
 * isToday(new Date('2024-01-15'))
 * Returns: true
 * 
 * isToday(new Date('2024-01-14'))
 * Returns: false
 */
export function isToday(date: DateInput): boolean {
  const d = toDate(date)
  const today = new Date()
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  )
}

/**
 * Check if date is in the past
 * @param date - Date to check
 * @returns True if date is before current time
 * @example
 * Assuming now is 2024-01-15 15:00:00
 * isPast(new Date('2024-01-15 14:00:00'))
 * Returns: true
 * 
 * isPast(new Date('2024-01-15 16:00:00'))
 * Returns: false
 */
export function isPast(date: DateInput): boolean {
  return toDate(date).getTime() < Date.now()
}

/**
 * Check if date is in the future
 * @param date - Date to check
 * @returns True if date is after current time
 * @example
 * Assuming now is 2024-01-15 15:00:00
 * isFuture(new Date('2024-01-15 16:00:00'))
 * Returns: true
 * 
 * isFuture(new Date('2024-01-15 14:00:00'))
 * Returns: false
 */
export function isFuture(date: DateInput): boolean {
  return toDate(date).getTime() > Date.now()
}

/**
 * Check if two dates are the same day
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if both dates are on the same day
 * @example
 * isSameDay(new Date('2024-01-15 10:00'), new Date('2024-01-15 20:00'))
 * Returns: true
 * 
 * isSameDay(new Date('2024-01-15'), new Date('2024-01-16'))
 * Returns: false
 */
export function isSameDay(date1: DateInput, date2: DateInput): boolean {
  const d1 = toDate(date1)
  const d2 = toDate(date2)
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  )
}

/**
 * Add days to date
 * @param date - Starting date
 * @param days - Number of days to add (can be negative)
 * @returns New date with days added
 * @example
 * addDays(new Date('2024-01-15'), 5)
 * Returns: Date object for 2024-01-20
 * 
 * addDays(new Date('2024-01-15'), -3)
 * Returns: Date object for 2024-01-12
 */
export function addDays(date: DateInput, days: number): Date {
  const result = toDate(date)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * Subtract days from date
 * @param date - Starting date
 * @param days - Number of days to subtract
 * @returns New date with days subtracted
 * @example
 * subtractDays(new Date('2024-01-15'), 5)
 * Returns: Date object for 2024-01-10
 */
export function subtractDays(date: DateInput, days: number): Date {
  return addDays(date, -days)
}

/**
 * Add hours to date
 * @param date - Starting date
 * @param hours - Number of hours to add (can be negative)
 * @returns New date with hours added
 * @example
 * addHours(new Date('2024-01-15T10:00:00'), 5)
 * Returns: Date object for 2024-01-15T15:00:00
 * 
 * addHours(new Date('2024-01-15T10:00:00'), -3)
 * Returns: Date object for 2024-01-15T07:00:00
 */
export function addHours(date: DateInput, hours: number): Date {
  const result = toDate(date)
  result.setHours(result.getHours() + hours)
  return result
}

/**
 * Add minutes to date
 * @param date - Starting date
 * @param minutes - Number of minutes to add (can be negative)
 * @returns New date with minutes added
 * @example
 * addMinutes(new Date('2024-01-15T10:00:00'), 30)
 * Returns: Date object for 2024-01-15T10:30:00
 */
export function addMinutes(date: DateInput, minutes: number): Date {
  const result = toDate(date)
  result.setMinutes(result.getMinutes() + minutes)
  return result
}

/**
 * Get start of day (00:00:00.000)
 * @param date - Input date
 * @returns New date set to start of day
 * @example
 * startOfDay(new Date('2024-01-15T14:30:45.123'))
 * Returns: Date object for 2024-01-15T00:00:00.000
 */
export function startOfDay(date: DateInput): Date {
  const d = toDate(date)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Get end of day (23:59:59.999)
 * @param date - Input date
 * @returns New date set to end of day
 * @example
 * endOfDay(new Date('2024-01-15T14:30:45.123'))
 * Returns: Date object for 2024-01-15T23:59:59.999
 */
export function endOfDay(date: DateInput): Date {
  const d = toDate(date)
  d.setHours(23, 59, 59, 999)
  return d
}

/**
 * Get difference between two dates in days
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Number of days between dates (can be negative)
 * @example
 * differenceInDays(new Date('2024-01-20'), new Date('2024-01-15'))
 * Returns: 5
 * 
 * differenceInDays(new Date('2024-01-15'), new Date('2024-01-20'))
 * Returns: -5
 */
export function differenceInDays(date1: DateInput, date2: DateInput): number {
  const d1 = toDate(date1)
  const d2 = toDate(date2)
  const diffInMs = d1.getTime() - d2.getTime()
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24))
}

/**
 * Get difference between two dates in hours
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Number of hours between dates (can be negative)
 * @example
 * differenceInHours(new Date('2024-01-15T15:00'), new Date('2024-01-15T10:00'))
 * Returns: 5
 */
export function differenceInHours(date1: DateInput, date2: DateInput): number {
  const d1 = toDate(date1)
  const d2 = toDate(date2)
  const diffInMs = d1.getTime() - d2.getTime()
  return Math.floor(diffInMs / (1000 * 60 * 60))
}

/**
 * Get difference between two dates in minutes
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Number of minutes between dates (can be negative)
 * @example
 * differenceInMinutes(new Date('2024-01-15T10:30'), new Date('2024-01-15T10:00'))
 * Returns: 30
 */
export function differenceInMinutes(date1: DateInput, date2: DateInput): number {
  const d1 = toDate(date1)
  const d2 = toDate(date2)
  const diffInMs = d1.getTime() - d2.getTime()
  return Math.floor(diffInMs / (1000 * 60))
}

/**
 * Check if a date is a weekend (Saturday or Sunday)
 * @param date - Date to check
 * @returns True if date is Saturday or Sunday
 * @example
 * isWeekend(new Date('2024-01-20')) Saturday
 * Returns: true
 * 
 * isWeekend(new Date('2024-01-15')) Monday
 * Returns: false
 */
export function isWeekend(date: DateInput): boolean {
  const d = toDate(date)
  const day = d.getDay()
  return day === 0 || day === 6
}

/**
 * Format date to ISO string (YYYY-MM-DD)
 * @param date - Date to format
 * @returns ISO date string
 * @example
 * formatISO(new Date('2024-01-15T14:30:00'))
 * Returns: "2024-01-15"
 */
export function formatISO(date: DateInput): string {
  const d = toDate(date)
  return d.toISOString().split('T')[0]
}

/**
 * Parse ISO date string to Date object
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @returns Date object
 * @example
 * parseISO('2024-01-15')
 * Returns: Date object for 2024-01-15
 */
export function parseISO(dateString: string): Date {
  return toDate(dateString)
}