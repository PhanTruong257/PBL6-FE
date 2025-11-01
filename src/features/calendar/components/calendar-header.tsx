import { ChevronLeft, ChevronRight, Search, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { ViewMode } from '../types'

interface CalendarHeaderProps {
    monthYear: string
    viewMode: ViewMode
    onViewModeChange: (mode: ViewMode) => void
    onPreviousWeek: () => void
    onNextWeek: () => void
    onGoToToday: () => void
}

export function CalendarHeader({
    monthYear,
    viewMode,
    onViewModeChange,
    onPreviousWeek,
    onNextWeek,
    onGoToToday
}: CalendarHeaderProps) {
    return (
        <div className="flex items-center justify-between border-b px-6 py-4 bg-background">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-600 rounded-sm flex items-center justify-center">
                        <span className="text-white text-xs font-bold">📅</span>
                    </div>
                    <h1 className="text-xl font-semibold">Calendar</h1>
                </div>

                <div className="flex items-center gap-2 ml-8">
                    <Button variant="outline" size="sm" onClick={onPreviousWeek}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-base font-medium min-w-[140px] text-center">
                        {monthYear}
                    </div>
                    <Button variant="outline" size="sm" onClick={onNextWeek}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-2 ml-8">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search"
                        className="w-64"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onGoToToday}
                >
                    Today
                </Button>
                <Button
                    variant={viewMode === 'day' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onViewModeChange('day')}
                >
                    Day
                </Button>
                <Button
                    variant={viewMode === 'week' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onViewModeChange('week')}
                >
                    Week
                </Button>
                <Button
                    variant={viewMode === 'month' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onViewModeChange('month')}
                >
                    Month
                </Button>

                <div className="w-px h-6 bg-border mx-2"></div>

                <Button variant="ghost" size="sm">
                    <span className="text-lg">⚙️</span>
                </Button>
                <Button variant="ghost" size="sm">
                    <span className="text-lg">🔔</span>
                </Button>
                <Button variant="ghost" size="sm">
                    <span className="text-lg">👤</span>
                </Button>
                <Button variant="ghost" size="sm">
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}