import {
  type ExamWithQuestions,
  type Question,
  type QuestionCategory,
  type CreateExamRequest,
  type UpdateExamRequest,
  type GetExamsQuery,
  type GetQuestionsQuery,
  type QuestionBank,
  type GetRandomQuestionsRequest,
  type RandomQuestionsResponse,
  QuestionType,
  ExamStatus,
} from '@/types/exam'
import { httpClient } from '@/libs/http'

/**
 * Exam Service - API calls for exam management
 */
export const ExamService = {
  /**
   * Get list of questions from question bank
   */
  async getQuestions(query?: GetQuestionsQuery): Promise<QuestionBank> {
    try {
      // Build query parameters
      const params: Record<string, any> = {}
      
      if (query?.search) {
        params.search = query.search
      }
      
      if (query?.type) {
        // Map frontend enum to backend enum format
        const typeMap: Record<QuestionType, string> = {
          [QuestionType.MCQ]: 'multiple_choice',
          [QuestionType.ESSAY]: 'essay',
        }
        params.type = typeMap[query.type] || query.type
      }
      
      if (query?.difficulty) {
        params.difficulty = query.difficulty
      }
      
      // Pagination
      params.page = query?.page || 1
      params.limit = query?.limit || 10

      // Make API call to backend
      const response = await httpClient.get('/questions', { params })
      
      // Backend returns: { success, message, data: { data: questions[], meta: { total, page, limit } } }
      const result = response.data.data
      
      // Transform backend questions to frontend format
      const transformedQuestions = (result.value || []).map((q: any) => {
        const question: Question = {
          question_id: q.question_id,
          content: q.content,
          type: q.type,
          difficulty: q.difficulty,
          tags: q.tags || [],
          is_multiple_answer: q.is_multiple_answer || false,
          created_at: q.created_at,
        }
        // For multiple_choice questions, transform answers array to options array
        if (q.type === 'multiple_choice' && q.options.answers && Array.isArray(q.options.answers)) {
          question.options = q.options.answers.map((answer: any) => answer.text)
          // // Find the correct answer
          const correctAnswer = q.options.answers.find((answer: any) => answer.is_correct)
          if (correctAnswer) {
            question.correct_answer = correctAnswer.text
          }
        }

        return question
      })
      
      return {
        questions: transformedQuestions,
        total: result.meta?.total || 0,
        page: result.meta?.page || 1,
        limit: result.meta?.limit || 10,
      }
    } catch (error) {
      console.error('Error fetching questions:', error)
      // Return empty result on error
      return {
        questions: [],
        total: 0,
        page: query?.page || 1,
        limit: query?.limit || 10,
      }
    }
  },

  /**
   * Get a single question by ID
   */
  async getQuestionById(id: number): Promise<Question | null> {
    try {
      const response = await httpClient.get(`/questions/${id}`)
      const q = response.data.data
      
      if (!q) return null

      const question: Question = {
        question_id: q.question_id,
        content: q.content,
        type: q.type,
        difficulty: q.difficulty,
        tags: q.tags || [],
        created_at: q.created_at,
      }

      // For multiple_choice questions, transform answers array to options array
      if (q.type === 'multiple_choice' && q.answers && Array.isArray(q.answers)) {
        question.options = q.answers.map((answer: any) => answer.text)
        // Find the correct answer
        const correctAnswer = q.answers.find((answer: any) => answer.is_correct)
        if (correctAnswer) {
          question.correct_answer = correctAnswer.text
        }
      }

      return question
    } catch (error) {
      console.error('Error fetching question by ID:', error)
      return null
    }
  },

  /**
   * Get list of exams
   */
  async getExams(query?: GetExamsQuery): Promise<{ data: ExamWithQuestions[], meta: { total: number, page: number, limit: number } }> {
    try {
      const params: Record<string, any> = {}
      
      if (query?.search) {
        params.search = query.search
      }
      
      if (query?.status) {
        params.status = query.status
      }
      
      if (query?.start_time) {
        params.start_time = query.start_time
      }
      
      if (query?.end_time) {
        params.end_time = query.end_time
      }
      
      // Pagination
      params.page = query?.page || 1
      params.limit = query?.limit || 10

      const response = await httpClient.get('/exams', { params })
      
      const result = response.data.data
      
      // Transform backend exams to frontend format
      const exams = (result.value || []).map((exam: any) => ({
        exam_id: exam.exam_id,
        class_id: exam.class_id,
        title: exam.title,
        description: exam.description,
        duration: exam.total_time,
        start_time: exam.start_time,
        end_time: exam.end_time,
        status: exam.status,
        created_by: exam.created_by,
        created_at: exam.created_at,
        total_points: exam.total_points,
        questions: exam.question_exams?.map((qe: any) => ({
          question_id: qe.question.question_id,
          content: qe.question.content,
          type: qe.question.type,
          difficulty: qe.question.difficulty,
          tags: qe.question.tags || [],
          created_at: qe.question.created_at,
          points: qe.points,
          order: qe.order,
          options: qe.question.type === 'multiple_choice' && qe.question.options?.answers
            ? qe.question.options.answers.map((a: any) => a.text)
            : undefined,
          correct_answer: qe.question.type === 'multiple_choice' && qe.question.options?.answers
            ? qe.question.options.answers.find((a: any) => a.is_correct)?.text
            : undefined,
        })) || [],
      }))


      return {
        data: exams,
        meta: {
          total: result.pagination?.total || 0,
          page: result.pagination?.page || 1,
          limit: result.pagination?.limit || 10,
        }
      }
    } catch (error) {
      console.error('Error fetching exams:', error)
      return {
        data: [],
        meta: {
          total: 0,
          page: query?.page || 1,
          limit: query?.limit || 10,
        }
      }
    }
  },

  /**
   * Get a single exam by ID
   */
  async getExamById(id: number): Promise<ExamWithQuestions | null> {
    try {
      const response = await httpClient.get(`/exams/${id}`)
      
      const result = response.data.data
      
      if (!result) return null

      // Transform backend response to frontend format
      const exam: ExamWithQuestions = {
        exam_id: result.exam_id,
        class_id: result.class_id,
        title: result.title,
        description: result.description,
        duration: result.total_time,
        start_time: result.start_time,
        end_time: result.end_time,
        status: result.status,
        created_by: result.created_by,
        created_at: result.created_at,
        questions: result.question_exams?.map((qe: any) => ({
          question_id: qe.question.question_id,
          content: qe.question.content,
          type: qe.question.type,
          difficulty: qe.question.difficulty,
          tags: qe.question.tags || [],
          created_at: qe.question.created_at,
          points: qe.points,
          order: qe.order,
          options: qe.question.type === 'multiple_choice' && qe.question.options?.answers
            ? qe.question.options.answers.map((a: any) => a.text)
            : undefined,
          correct_answer: qe.question.type === 'multiple_choice' && qe.question.options?.answers
            ? qe.question.options.answers.find((a: any) => a.is_correct)?.text
            : undefined,
        })) || [],
      }

      return exam
    } catch (error) {
      console.error('Error fetching exam by ID:', error)
      return null
    }
  },

  /**
   * Create a new exam
   */
  async createExam(data: CreateExamRequest): Promise<ExamWithQuestions> {
    try {
      
      // Transform frontend data to backend format
      const createExamPayload = {
        class_id: data.class_id,
        title: data.title,
        description: data.description,
        start_time: data.start_time,
        end_time: data.end_time,
        total_time: data.duration || 45, // duration in minutes
        status: 'draft',
        created_by: 1,
        questions: data.questions.map((q, index) => ({
          question_id: q.question_id,
          points: q.points,
          order: q.order !== undefined ? q.order : index,
        })),
      }

      const response = await httpClient.post('/exams', createExamPayload)
      
      const result = response.data.data
      
      // Transform backend response to frontend format
      const exam: ExamWithQuestions = {
        exam_id: result.exam_id,
        class_id: result.class_id,
        title: result.title,
        description: result.description,
        duration: result.total_time,
        start_time: result.start_time,
        end_time: result.end_time,
        status: result.status,
        created_by: result.created_by,
        created_at: result.created_at,
        total_points: data.total_points,
        questions: result.question_exams?.map((qe: any) => ({
          question_id: qe.question.question_id,
          content: qe.question.content,
          type: qe.question.type,
          difficulty: qe.question.difficulty,
          tags: qe.question.tags || [],
          created_at: qe.question.created_at,
          points: qe.points,
          order: qe.order,
          options: qe.question.type === 'multiple_choice' && qe.question.options?.answers
            ? qe.question.options.answers.map((a: any) => a.text)
            : undefined,
          correct_answer: qe.question.type === 'multiple_choice' && qe.question.options?.answers
            ? qe.question.options.answers.find((a: any) => a.is_correct)?.text
            : undefined,
        })) || [],
      }

      return exam
    } catch (error) {
      console.error('Error creating exam:', error)
      throw error
    }
  },

  /**
   * Update an existing exam
   */
  async updateExam(data: UpdateExamRequest): Promise<ExamWithQuestions> {
    try {
      // Transform frontend data to backend format
      const updateExamPayload: any = {
        class_id: data.class_id,
        title: data.title,
        description: data.description,
        start_time: data.start_time,
        end_time: data.end_time,
        total_time: data.duration,
        status: data.status,
      }

      // Add questions if provided
      if (data.questions) {
        updateExamPayload.questions = data.questions.map((q, index) => ({
          question_id: q.question_id,
          points: q.points,
          order: q.order !== undefined ? q.order : index,
        }))
      }

      const response = await httpClient.put(`/exams/${data.exam_id}`, updateExamPayload)
      
      const result = response.data.data
      
      // Transform backend response to frontend format
      const exam: ExamWithQuestions = {
        exam_id: result.exam_id,
        class_id: result.class_id,
        title: result.title,
        description: result.description,
        duration: result.total_time,
        start_time: result.start_time,
        end_time: result.end_time,
        status: result.status,
        created_by: result.created_by,
        created_at: result.created_at,
        total_points: data.total_points,
        questions: result.question_exams?.map((qe: any) => ({
          question_id: qe.question.question_id,
          content: qe.question.content,
          type: qe.question.type,
          difficulty: qe.question.difficulty,
          tags: qe.question.tags || [],
          created_at: qe.question.created_at,
          points: qe.points,
          order: qe.order,
          options: qe.question.type === 'multiple_choice' && qe.question.options?.answers
            ? qe.question.options.answers.map((a: any) => a.text)
            : undefined,
          correct_answer: qe.question.type === 'multiple_choice' && qe.question.options?.answers
            ? qe.question.options.answers.find((a: any) => a.is_correct)?.text
            : undefined,
        })) || [],
      }

      return exam
    } catch (error) {
      console.error('Error updating exam:', error)
      throw error
    }
  },

  /**
   * Delete an exam
   */
  async deleteExam(id: number): Promise<void> {
    try {
      await httpClient.delete(`/exams/${id}`)
    } catch (error) {
      console.error('Error deleting exam:', error)
      throw error
    }
  },

  /**
   * Publish an exam (change status from draft to published)
   */
  async publishExam(id: number): Promise<ExamWithQuestions> {
    return this.updateExam({
      exam_id: id,
      status: ExamStatus.published,
    })
  },

  async getClassNameOptions(): Promise<Array<{ id: number; class_name: string }>> {
    const response = await httpClient.get('/classes')
    const res = response.data.data.map((cls: any) => ({
      id: cls.class_id,
      class_name: cls.class_name,
    }))
    return res
  },

  /**
   * Get list of question categories
   */
  async getQuestionCategories(search?: string): Promise<QuestionCategory[]> {
    try {
      const params: Record<string, any> = {}
      
      if (search) {
        params.search = search
      }

      const response = await httpClient.get('/question-categories', { params })
      
      // Backend returns categories with question_count
      return response.data.data || []
    } catch (error) {
      console.error('Error fetching question categories:', error)
      return []
    }
  },

  /**
   * Get a single question category by ID
   */
  async getQuestionCategoryById(id: number): Promise<QuestionCategory | null> {
    try {
      const response = await httpClient.get(`/question-categories/${id}`)
      return response.data.data || null
    } catch (error) {
      console.error('Error fetching question category by ID:', error)
      return null
    }
  },

  /**
   * Get random questions based on criteria
   */
  async getRandomQuestions(request: GetRandomQuestionsRequest): Promise<RandomQuestionsResponse> {
    try {
      const response = await httpClient.post('/questions/random', request)
      
      // Transform questions if needed
      console.log('Raw random questions response from API:', response.data)
      const questions = response.data.data.value || []
      const transformedQuestions = questions.map((q: any) => {
        const question: Question = {
          question_id: q.question_id,
          content: q.content,
          type: q.type, 
          difficulty: q.difficulty,
          tags: q.tags || [],
          is_multiple_answer: q.is_multiple_answer || false,
          created_at: q.created_at,
        }
        
        // For multiple_choice questions, transform answers array to options array
        if (q.type === 'multiple_choice' && q.options?.answers && Array.isArray(q.options.answers)) {
          question.options = q.options.answers.map((answer: any) => answer.text)
          const correctAnswer = q.options.answers.find((answer: any) => answer.is_correct)
          if (correctAnswer) {
            question.correct_answer = correctAnswer.text
          }
        }

        return question
      })


      console.log('Random questions fetched from API:', transformedQuestions)

      return {
        data: transformedQuestions,
        total: response.data.data.total || 0,
        summary: response.data.data.summary || {
          requested: 0,
          fetched: 0,
          by_criteria: []
        }
      }
    } catch (error) {
      console.error('Error fetching random questions:', error)
      throw error
    }
  },
}
