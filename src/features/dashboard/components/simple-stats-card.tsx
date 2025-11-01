interface SimpleStatsCardProps {
    icon: string
    title: string
    value: string
    description: string
}

export function SimpleStatsCard({ icon, title, value, description }: SimpleStatsCardProps) {
    return (
        <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    {icon}
                </div>
                <h3 className="font-semibold">{title}</h3>
            </div>
            <p className="text-2xl font-bold mt-2">{value}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    )
}