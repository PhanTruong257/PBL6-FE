import { httpClient } from '@/libs/http'
import type {
  StartExamResponse,
  GetQuestionByOrderResponse,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
  ResumeExamResponse,
  SubmitExamResponse,
  UpdateRemainingTimeRequest,
  UpdateRemainingTimeResponse,
} from '@/types/submission'

/**
 * Submission Service - API calls for exam taking/submission
 */
export const SubmissionService = {
  /**
   * Start an exam or get existing submission
   */
  async startExam(examId: number): Promise<StartExamResponse> {
    const response = await httpClient.post(`/exams/${examId}/start`)
    return response.data.data
  },

  /**
   * Get a specific question by its order number
   */
  async getQuestionByOrder(
    submissionId: number,
    order: number
  ): Promise<GetQuestionByOrderResponse> {
    const response = await httpClient.get(
      `/submissions/${submissionId}/questions/${order}`
    )
    return response.data.data
  },

  /**
   * Submit or update an answer for a question
   */
  async submitAnswer(
    submissionId: number,
    data: SubmitAnswerRequest
  ): Promise<SubmitAnswerResponse> {
    const response = await httpClient.post(
      `/submissions/${submissionId}/answers`,
      data
    )
    return response.data.data
  },

  /**
   * Resume an exam at the current question
   */
  async resumeExam(submissionId: number): Promise<ResumeExamResponse> {
    const response = await httpClient.get(
      `/submissions/${submissionId}/resume`
    )
    return response.data.data
  },

  /**
   * Submit the entire exam (mark as complete)
   */
  async submitExam(submissionId: number): Promise<SubmitExamResponse> {
    const response = await httpClient.post(
      `/submissions/${submissionId}/submit`
    )
    return response.data.data
  },

  /**
   * Update remaining time for a submission
   */
  async updateRemainingTime(
    submissionId: number,
    data: UpdateRemainingTimeRequest
  ): Promise<UpdateRemainingTimeResponse> {
    const response = await httpClient.patch(
      `/submissions/${submissionId}/time`,
      data
    )
    return response.data.data
  },
}
