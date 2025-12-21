import type { Question } from '@/types/question'
import { useQuestionsTranslation } from '../hooks/use-questions-translation'

interface QuestionStatsProps {
  questions: Question[]
  totalQuestions?: number // Total from API, not just current page
}

export function QuestionStats({
  questions,
  totalQuestions,
}: QuestionStatsProps) {
  const { t } = useQuestionsTranslation()

  const stats = {
    total: totalQuestions ?? questions.length, // Use API total if provided
    multipleChoice: questions.filter((q) => q.type === 'multiple_choice')
      .length,
    essay: questions.filter((q) => q.type === 'essay').length,
    public: questions.filter((q) => q.is_public).length,
    easy: questions.filter((q) => q.difficulty === 'easy').length,
    medium: questions.filter((q) => q.difficulty === 'medium').length,
    hard: questions.filter((q) => q.difficulty === 'hard').length,
  }

  return (
    <div className="bg-card border rounded-lg p-4 space-y-3">
      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
        {t('stats.title')}
      </h3>

      <div className="space-y-2">
        <StatRow label={t('stats.total')} value={stats.total} highlight />
        <StatRow
          label={t('stats.multipleChoice')}
          value={stats.multipleChoice}
        />
        <StatRow label={t('stats.essay')} value={stats.essay} />
        <StatRow label={t('stats.public')} value={stats.public} />
      </div>

      <div className="pt-3 border-t space-y-2">
        <h4 className="font-semibold text-xs text-muted-foreground">
          {t('stats.difficulty')}
        </h4>
        <StatRow
          label={t('stats.easy')}
          value={stats.easy}
          color="text-green-600"
        />
        <StatRow
          label={t('stats.medium')}
          value={stats.medium}
          color="text-yellow-600"
        />
        <StatRow
          label={t('stats.hard')}
          value={stats.hard}
          color="text-red-600"
        />
      </div>
    </div>
  )
}

interface StatRowProps {
  label: string
  value: number
  highlight?: boolean
  color?: string
}

function StatRow({ label, value, highlight, color }: StatRowProps) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-muted-foreground">{label}:</span>
      <span
        className={`font-bold ${highlight ? 'text-primary text-lg' : ''} ${
          color || ''
        }`}
      >
        {value}
      </span>
    </div>
  )
}
