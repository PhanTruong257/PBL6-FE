/**
 * Exam types based on Prisma schema
 */

export enum ExamStatus {
  draft = 'draft',
  published = 'published',
  in_progress = 'in_progress',
  completed = 'completed',
  cancelled = 'cancelled',
} 

export enum QuestionType {
  MCQ = 'multiple_choice', // Multiple Choice
  ESSAY = 'essay',
}

export enum QuestionDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export interface QuestionCategory {
  category_id: number
  name: string
  description?: string
  created_at: string
  updated_at: string
  question_count: number
}

export interface Question {
  question_id: number
  content: string
  type: QuestionType
  options?: string[] // For MCQ
  correct_answer?: string
  difficulty?: QuestionDifficulty // Added field
  tags?: string[] // Added field for categorization
  is_multiple_answer?: boolean // Added field for MCQ
  created_at: string
}

export interface QuestionExam {
  question_id: number
  exam_id: number
  points: number
  order?: number // Added field for question order
}

export interface Exam {
  exam_id: number
  class_id: number
  title: string
  description?: string // Added field
  duration?: number // Added field (in minutes)
  start_time: string
  end_time: string
  status: ExamStatus
  created_by: number
  created_at: string
  total_points?: number // Added field
}

export interface ExamWithQuestions extends Exam {
  questions: Array<Question & { points: number; order?: number }>
}

export interface Submission {
  submission_id: number
  exam_id: number
  student_id: number
  submitted_at: string
  score?: number
  teacher_feedback?: string
  graded_at?: string
  graded_by?: number
}

export interface SubmissionAnswer {
  answer_id: number
  submission_id: number
  question_id: number
  answer_content: string
  is_correct: boolean
  points_earned: number
  comment?: string
  comment_by?: number
}

// API Request/Response types
export interface CreateExamRequest {

  class_id: number
  title: string
  description?: string
  duration?: number
  start_time: string
  end_time: string
  total_points?: number
  allow_review?: boolean
  create_by?: number
  questions: Array<{
    question_id: number
    points: number
    order?: number
  }>
}

export interface UpdateExamRequest extends Partial<CreateExamRequest> {
  exam_id: number
  status?: ExamStatus
}

export interface GetExamsQuery {
  class_id?: number
  status?: ExamStatus
  search?: string
  start_time?: string
  end_time?: string
  page?: number
  limit?: number
}

export interface GetQuestionsQuery {
  type?: QuestionType
  difficulty?: QuestionDifficulty
  tags?: string[]
  search?: string
  page?: number
  limit?: number
}

// Random Questions types
export interface RandomQuestionCriterion {
  category_id: number // Backend expects snake_case
  type: string // Backend expects 'type' not 'questionType'
  difficulty?: string // Backend expects 'difficulty' (optional)
  quantity: number // Backend expects 'quantity' not 'count'
}

export interface GetRandomQuestionsRequest {
  criteria: RandomQuestionCriterion[]
  userId: number
}

export interface RandomQuestionsResponse {
  data: Question[] // Backend returns 'value' not 'data'
  total: number
  summary: {
    requested: number
    fetched: number
    by_criteria: Array<{
      category_id: number // Backend uses snake_case
      type: string
      requested: number
      fetched: number
      available: number
    }>
  }
}

// Question Bank types
export interface QuestionBank {
  questions: Question[]
  total: number
  page: number
  limit: number
}

// Student Exam types
export interface StudentSubmission {
  submission_id: number
  status: 'in_progress' | 'submitted' | 'graded'
  score?: number
  submitted_at: string
  remaining_time?: number
  current_question_order?: number
}

export interface StudentExam extends Exam {
  question_exams: Array<{
    question_id: number
    exam_id: number
    order: number
    points: number
    question: Question
  }>
  submissions: StudentSubmission[]
  _count: {
    submissions: number
  }
}

export interface GetStudentExamsQuery {
  search?: string
  status?: ExamStatus
  start_time?: string
  end_time?: string
  page?: number
  limit?: number
}

export interface StudentExamsResponse {
  data: StudentExam[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// Submission types
export enum SubmissionStatus {
  IN_PROGRESS = 'in_progress',
  SUBMITTED = 'submitted',
  CANCELLED = 'cancelled',
  GRADED = 'graded',
}

export interface SubmissionWithDetails extends Submission {
  status: SubmissionStatus
  current_question_order?: number
  remaining_time?: number
  answers: Array<SubmissionAnswer & {
    question: Question
  }>
  exam: Exam
}

export interface SubmissionsListResponse {
  data: SubmissionWithDetails[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface GetSubmissionsQuery {
  exam_id?: number
  student_id?: number
  status?: SubmissionStatus
  page?: number
  limit?: number
}
