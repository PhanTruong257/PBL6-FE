interface TimeColumnProps {
    timeSlots: string[]
}

export function TimeColumn({ timeSlots }: TimeColumnProps) {
    return (
        <div className="w-16 border-r bg-muted/20 flex-shrink-0">
            <div className="min-h-full">
                {timeSlots.map((time) => (
                    <div key={time} className="h-16 flex items-start justify-end pr-3 pt-1 border-b border-border/10">
                        <span className="text-xs text-muted-foreground">{time}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}