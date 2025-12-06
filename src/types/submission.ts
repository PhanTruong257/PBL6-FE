/**
 * Submission types based on backend API
 */

export enum SubmissionStatus {
  IN_PROGRESS = 'in_progress',
  SUBMITTED = 'submitted',
  CANCELLED = 'cancelled',
  GRADED = 'graded',
}

export interface Submission {
  submission_id: number
  exam_id: number
  student_id: number
  status: SubmissionStatus
  current_question_order: number
  remaining_time: number
  score?: number
  submitted_at?: string
  graded_at?: string
  graded_by?: number
  created_at: string
  updated_at: string
}

export interface SubmissionAnswer {
  answer_id: number
  submission_id: number
  question_id: number
  answer_content: string
  is_correct?: boolean
  points_earned?: number
  comment?: string
  comment_by?: number
  created_at: string
  updated_at: string
}

// API Response types
export interface StartExamResponse {
  submission_id: number
  exam_id: number
  exam_title: string
  student_id: number
  current_question_order: number
  remaining_time: number
  total_questions: number
  question: ExamQuestion
}

export interface ExamQuestion {
  question_id: number
  order: number
  points: number
  content: string
  type: string
  difficulty: string
  is_multiple_answer: boolean
  options?: {
    answers: Array<{
      id: string
      text: string
      is_correct?: boolean
    }>
  }
  category?: {
    category_id: number
    name: string
  }
}

export interface QuestionOption {
  id: string
  text: string
  is_correct?: boolean
}

export interface GetQuestionByOrderResponse {
  submission_id: number
  current_question_order: number
  remaining_time: number
  total_questions: number
  question: ExamQuestion
  existing_answer?: {
    answer_id: number
    answer_content: string
  }
}

export interface SubmitAnswerRequest {
  question_id: number
  answer_content: string
}

export interface SubmitAnswerResponse {
  answer_id: number
  question_id: number
  answer_content: string
  message: string
}

export interface ResumeExamResponse {
  submission_id: number
  exam_id: number
  exam_title: string
  student_id: number
  current_question_order: number
  remaining_time: number
  total_questions: number
  answered_count: number
  question: ExamQuestion
  existing_answer?: {
    answer_id: number
    answer_content: string
  }
}

export interface SubmitExamResponse {
  submission_id: number
  exam_id: number
  student_id: number
  status: SubmissionStatus
  submitted_at: string
  total_questions: number
  answered_questions: number
  message: string
}

export interface UpdateRemainingTimeRequest {
  remaining_time: number
}

export interface UpdateRemainingTimeResponse {
  submission_id: number
  remaining_time: number
  message: string
}

export interface VerifyExamPasswordRequest {
  password: string
}

export interface VerifyExamPasswordResponse {
  success: boolean
  message: string
  has_password: boolean
}
