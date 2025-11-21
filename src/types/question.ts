export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  ESSAY: 'essay',
} as const

export type QuestionType = typeof QUESTION_TYPES[keyof typeof QUESTION_TYPES]

export const QUESTION_DIFFICULTIES = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
} as const

export type QuestionDifficulty = typeof QUESTION_DIFFICULTIES[keyof typeof QUESTION_DIFFICULTIES]

export interface QuestionOption {
  id: number
  text: string // Prefix: '=' for correct, '~' for incorrect
}

// ============================================================
// QUESTION CATEGORY INTERFACES
// ============================================================
export interface QuestionCategory {
  category_id: number
  name: string
  description?: string
  created_by: number
  question_count?: number
  created_at: string
  updated_at: string
}

export interface CreateQuestionCategoryRequest {
  name: string
  description?: string
  created_by: number // Required: current user's ID from Recoil
}

export interface UpdateQuestionCategoryRequest {
  name?: string
  description?: string
}

// ============================================================
// QUESTION INTERFACES
// ============================================================
export interface Question {
  question_id: number
  content: string
  type: QuestionType
  difficulty: QuestionDifficulty
  category_id?: number
  
  // Multiple choice specific
  is_multiple_answer: boolean
  options?: QuestionOption[]
  
  // Metadata
  created_by: number
  is_public: boolean
  created_at: string
  updated_at: string
  
  category?: QuestionCategory
  question_exams?: Array<{
    exam_id: number
    points: number
    exam: {
      exam_id: number
      title: string
      status: string
    }
  }>
}

export interface CreateQuestionRequest {
  content: string
  type: QuestionType
  difficulty: QuestionDifficulty
  category_id?: number
  is_multiple_answer?: boolean
  options?: QuestionOption[]
  is_public?: boolean
  created_by: number // Required: current user's ID from Recoil
}

export interface UpdateQuestionRequest {
  content?: string
  type?: QuestionType
  difficulty?: QuestionDifficulty
  category_id?: number
  is_multiple_answer?: boolean
  options?: QuestionOption[]
  is_public?: boolean
}

export interface QuestionFilterParams {
  type?: QuestionType
  difficulty?: QuestionDifficulty
  category_id?: number
  page?: number
  limit?: number
  search?: string
  is_public?: boolean
  created_by?: number
}

export interface QuestionListResponse {
  data: Question[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface CategoryListResponse {
  data: QuestionCategory[]
  meta: {
    total: number
  }
}

// ============================================================
// IMPORT EXCEL INTERFACES
// ============================================================
export interface ExcelQuestionRow {
  content: string
  type: string
  category_name?: string
  difficulty?: string
  is_multiple_answer?: string
  A?: string
  B?: string
  C?: string
  D?: string
  E?: string
  F?: string
  G?: string
  H?: string
  I?: string
  J?: string
  correct_answers?: string
  is_public?: string
  status?: string
}

export interface ImportQuestionError {
  row: number
  content: string
  errors: string[]
}

export interface ImportQuestionResult {
  success: boolean
  total: number
  imported: number
  failed: number
  errors: ImportQuestionError[]
}

export interface PreviewExcelResult {
  total: number
  preview: ExcelQuestionRow[]
  headers: string[]
}

