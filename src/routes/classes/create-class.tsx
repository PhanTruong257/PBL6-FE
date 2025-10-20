import { createFileRoute } from '@tanstack/react-router'
import { CreateClassPage } from '../../features/teacher/create-class'

export const Route = createFileRoute('/classes/create-class')({
  component: CreateClassPage,
})

