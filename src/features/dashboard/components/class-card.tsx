import { Button } from '@/components/ui/button'
import { MoreHorizontal, Calendar, Users, BookOpen } from 'lucide-react'

interface ClassCardProps {
  id: string
  name: string
  code: string
  color?:
    | 'blue'
    | 'pink'
    | 'purple'
    | 'gray'
    | 'green'
    | 'orange'
    | 'teal'
    | 'indigo'
  teacher?: string
  students?: number
  onClick?: () => void
}

const colorClasses = {
  blue: 'bg-blue-500',
  pink: 'bg-pink-500',
  purple: 'bg-purple-500',
  gray: 'bg-gray-500',
  green: 'bg-green-500',
  orange: 'bg-orange-500',
  teal: 'bg-teal-500',
  indigo: 'bg-indigo-500',
}

const colors = [
  'blue',
  'pink',
  'purple',
  'gray',
  'green',
  'orange',
  'teal',
  'indigo',
] as const

export function ClassCard({ name, code, color, onClick }: ClassCardProps) {
  // Random color nếu không có
  const selectedColor =
    color || colors[Math.floor(Math.random() * colors.length)]
  return (
    <div
      className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all cursor-pointer overflow-hidden h-full"
      onClick={onClick}
    >
      {/* Header with colored background */}
      <div
        className={`${colorClasses[selectedColor]} p-3 text-white flex items-center justify-between`}
      >
        <div className="flex items-center space-x-2.5 flex-1 min-w-0">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {code}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-white text-sm leading-4 line-clamp-2">
              {name}
            </h3>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-white hover:bg-white/20 flex-shrink-0 ml-2"
          onClick={(e) => {
            e.stopPropagation()
            console.log('More options for:', name)
          }}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Content - ensure white background */}
      <div className="p-4 bg-white">
        {/* Action icons */}
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 hover:bg-gray-100"
          >
            <Calendar className="h-5 w-5 text-gray-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 hover:bg-gray-100"
          >
            <BookOpen className="h-5 w-5 text-gray-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 hover:bg-gray-100"
          >
            <Users className="h-5 w-5 text-gray-600" />
          </Button>
        </div>
      </div>
    </div>
  )
}
