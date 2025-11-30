import { httpClient } from '@/libs/http'
import type {
  SubmissionsListResponse,
  SubmissionWithDetails,
  GetSubmissionsQuery,
} from '@/types/exam'

/**
 * Get submissions by exam ID with pagination
 */
export async function getSubmissionsByExam(
  examId: number,
  params?: GetSubmissionsQuery
): Promise<SubmissionsListResponse> {
  const { page = 1, limit = 10, ...rest } = params || {}
  
  const response = await httpClient.get(`/submissions/exam/${examId}`, {
    params: {
      page,
      limit,
      ...rest,
    },
  })
  
  return response.data.data
}

/**
 * Get submission detail by ID
 */
export async function getSubmissionById(
  submissionId: number
): Promise<SubmissionWithDetails> {
  const response = await httpClient.get(`/submissions/${submissionId}`)
  return response.data.data
}

/**
 * Grade a submission
 */
export async function gradeSubmission(
  submissionId: number,
  data: {
    score: number
    teacher_feedback?: string
    graded_by: number
  }
): Promise<SubmissionWithDetails> {
  const response = await httpClient.put(
    `/exams/submissions/${submissionId}/grade`,
    data
  )
  return response.data
}

/**
 * Update individual answer grades and comments
 */
export async function updateAnswerGrades(
  submissionId: number,
  answers: Array<{
    answer_id: number
    points_earned?: number
    comment?: string
  }>
): Promise<SubmissionWithDetails> {
  const response = await httpClient.put(
    `/submissions/${submissionId}/answers`,
    { answers }
  )
  return response.data.data
}

/**
 * Confirm grading (change status to graded without modifying answers)
 */
export async function confirmGrading(
  submissionId: number,
  graded_by?: number
): Promise<SubmissionWithDetails> {
  const response = await httpClient.put(
    `/submissions/${submissionId}/confirm-grading`,
    { graded_by }
  )
  return response.data.data
}
