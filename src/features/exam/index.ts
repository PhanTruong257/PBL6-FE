// Export types
export type {
  Question,
  QuestionExam,
  Exam,
  ExamWithQuestions,
  Submission,
  SubmissionAnswer,
  CreateExamRequest,
  UpdateExamRequest,
  GetExamsQuery,
  GetQuestionsQuery,
  QuestionBank as QuestionBankType,
} from '@/types/exam'

export { ExamStatus, QuestionType, QuestionDifficulty } from '@/types/exam'

// Export API
export { ExamService } from './api/exam-service'

// Export components
export { CreateExamForm } from './components/create-exam-form'
export { ExamBasicInfo } from './components/exam-basic-info'
export { QuestionBank } from './components/question-bank'
export { SelectedQuestions } from './components/selected-questions'
export { QuestionCard } from './components/question-card'
export type { SelectedQuestion } from './components/create-exam-form'

// Export pages
export { CreateExamPage } from './pages/create-exam-page'
export { EditExamPage } from './pages/edit-exam-page'

// Export hooks
export {
  useQuestions,
  useQuestion,
  useExams,
  useExam,
  useCreateExam,
  useUpdateExam,
  useDeleteExam,
  usePublishExam,
} from './hooks/use-exam'
