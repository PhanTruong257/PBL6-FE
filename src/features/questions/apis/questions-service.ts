import { httpClient } from '@/libs/http'
import type { IApiResponse } from '@/types/api'
import type {
  Question,
  QuestionListResponse,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  QuestionFilterParams,
  QuestionCategory,
  CreateQuestionCategoryRequest,
  UpdateQuestionCategoryRequest,
  ImportQuestionResult,
  PreviewExcelResult,
} from '@/types/question'

// ============================================================
// QUESTION CATEGORY API
// ============================================================
export const categoriesApi = {
  /**
   * Get all question categories.
   */
  getAll: async (): Promise<QuestionCategory[]> => {
    const response = await httpClient.get<IApiResponse<QuestionCategory[]>>('/question-categories')
    console.log('Response: ', response)
    const categories = response.data.data
    console.log('Categories: ', categories)
    return categories
  },

  /**
   * Get category by ID
   */
  getById: async (id: number): Promise<QuestionCategory> => {
    const response = await httpClient.get<IApiResponse<QuestionCategory>>(`/question-categories/${id}`)
    return response.data.data
  },

  /**
   * Create new category (teachers only)
   */
  create: async (data: CreateQuestionCategoryRequest): Promise<QuestionCategory> => {
    const response = await httpClient.post<IApiResponse<QuestionCategory>>('/question-categories', data)
    return response.data.data
  },

  /**
   * Update category
   */
  update: async (id: number, data: UpdateQuestionCategoryRequest): Promise<QuestionCategory> => {
    const response = await httpClient.put<IApiResponse<QuestionCategory>>(`/question-categories/${id}`, data)
    return response.data.data
  },

  /**
   * Delete category (only if no questions use it)
   */
  delete: async (id: number): Promise<void> => {
    await httpClient.delete(`/question-categories/${id}`)
  },
}

// ============================================================
// QUESTION API
// ============================================================
export const questionsApi = {
  /**
   * Get all questions with filters and pagination
   */
  getAll: async (params?: QuestionFilterParams): Promise<QuestionListResponse> => {
    const response = await httpClient.get<IApiResponse<QuestionListResponse>>('/questions', { params })
    // Backend returns {data: [], meta: {}}, ensure we have default values
    const result = response.data.data
    return result
  },

  /**
   * Get question by ID with full details
   */
  getById: async (id: number): Promise<Question> => {
    const response = await httpClient.get<IApiResponse<Question>>(`/questions/${id}`)
    return response.data.data
  },

  /**
   * Create new question (teachers only)
   */
  create: async (data: CreateQuestionRequest): Promise<Question> => {
    const response = await httpClient.post<IApiResponse<Question>>('/questions', data)
    return response.data.data
  },

  /**
   * Update existing question (only creator can update)
   */
  update: async (id: number, data: UpdateQuestionRequest): Promise<Question> => {
    const response = await httpClient.put<IApiResponse<Question>>(`/questions/${id}`, data)
    return response.data.data
  },

  /**
   * Delete question (only if not used in any exam)
   */
  delete: async (id: number): Promise<void> => {
    await httpClient.delete(`/questions/${id}`)
  },

  /**
   * Search questions
   */
  search: async (searchTerm: string, filters?: Omit<QuestionFilterParams, 'search'>): Promise<QuestionListResponse> => {
    const params = {
      ...filters,
      search: searchTerm,
    }
    const response = await httpClient.get<IApiResponse<QuestionListResponse>>('/questions', { params })
    const result = response.data.data
    return result
  },

  /**
   * Preview Excel import
   */
  previewImport: async (file: File, limit?: number): Promise<PreviewExcelResult> => {
    const formData = new FormData()
    formData.append('file', file)
    
    // Build URL with query parameter
    const url = `/questions/import/preview${limit ? `?limit=${limit}` : ''}`
    
    const response = await httpClient.post<IApiResponse<PreviewExcelResult>>(
      url,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data.data
  },

  /**
   * Import questions from Excel
   */
  importExcel: async (file: File): Promise<ImportQuestionResult> => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await httpClient.post<IApiResponse<ImportQuestionResult>>(
      '/questions/import',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data.data
  },

  /**
   * Download Excel template from frontend public folder
   */
  downloadTemplate: () => {
    // Create a temporary <a> tag to trigger download
    const link = document.createElement('a')

    // Set attributes of the link
    link.href = '/templates/excels/TemplateImportQuestions.xlsx'
    link.download = 'TemplateImportQuestions.xlsx'
    link.target = '_blank'

    // Append to body, trigger click, and remove
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  },

  /**
   * Export questions to Excel
   */
  exportToExcel: async (params?: QuestionFilterParams): Promise<void> => {
    const response = await httpClient.get('/questions/export/excel', {
      params,
      responseType: 'blob',
    })
    
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `questions_export_${new Date().toISOString().split('T')[0]}.xlsx`
    link.click()
    window.URL.revokeObjectURL(url)
  },

  /**
   * Export questions to text file
   */
  exportToText: async (params?: QuestionFilterParams): Promise<void> => {
    const response = await httpClient.get('/questions/export/text', {
      params,
      responseType: 'blob',
    })
    
    const blob = new Blob([response.data], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `questions_export_${new Date().toISOString().split('T')[0]}.txt`
    link.click()
    window.URL.revokeObjectURL(url)
  },

  /**
   * Export questions to Word document
   */
  exportToDocx: async (params?: QuestionFilterParams): Promise<void> => {
    const response = await httpClient.get('/questions/export/docx', {
      params,
      responseType: 'blob',
    })
    
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `questions_export_${new Date().toISOString().split('T')[0]}.docx`
    link.click()
    window.URL.revokeObjectURL(url)
  },
}
