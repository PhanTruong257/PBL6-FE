import { createFileRoute } from '@tanstack/react-router'
import { CreateExamPage } from '@/features/exam'

export const Route = createFileRoute('/exam/create')({
  component: CreateExamPage,
})
