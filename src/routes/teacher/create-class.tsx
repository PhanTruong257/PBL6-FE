import { createFileRoute } from '@tanstack/react-router'
import { CreateClassPage } from '../../features/teacher/create-class'

export const Route = createFileRoute('/teacher/create-class')({
  component: CreateClassPage,
})

