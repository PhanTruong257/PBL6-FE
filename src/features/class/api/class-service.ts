import { httpClient } from '@/libs/http'
import type { User } from '@/types'

export interface CreateClassRequest {
  class_name: string
  class_code: string
  description?: string | null
  teacher_id: number
}

export interface CreateClassResponse {
  message: string
  class: {
    class_id: number
    class_name: string
    class_code: string
    description: string | null
    teacher_id: number
    created_at: string
  }
}

export interface Class {
  class_id: number
  class_name: string
  class_code: string
  description: string | null
  teacher_id: number
  created_at: string
  enrollments?: Array<{
    enrollment_id: number
    class_id: number
    student_id: number
    enrolled_at: string
  }>
}

export interface GetClassesResponse {
  success: boolean
  message: string
  data: Class[]
  error?: string
}

export interface AddMemberRequest {
  classId: number
  students: Array<{
    id: number
    email: string
    firstName: string
    lastName: string
  }>
}

export interface UpdateClassRequest {
  class_name?: string
  class_code?: string
  description?: string
}

export interface JoinClassRequest {
  class_code: string
  user_id: number
}

/**
 * Class Service - Unified API calls for class management
 */
export class ClassService {
  /**
   * Create a new class
   */
  static async CreateClass(
    data: CreateClassRequest,
  ): Promise<CreateClassResponse> {
    console.log('📤 Sending create class request:', data)
    const response = await httpClient.post<CreateClassResponse>(
      '/classes/create',
      data,
    )
    console.log('📥 Received response:', response)
    console.log('📦 Response data:', response.data)
    return response.data
  }

  /**
   * Get all classes
   */
  static async GetAllClasses(): Promise<GetClassesResponse> {
    const response = await httpClient.get<GetClassesResponse>('/classes')
    return response.data
  }

  /**
   * Get classes by teacher ID
   */
  static async GetClassesByTeacher(
    teacherId: number,
  ): Promise<GetClassesResponse> {
    const response = await httpClient.get<GetClassesResponse>(
      `/classes/of/teacher/${teacherId}`,
    )
    return response.data
  }

  /**
   * Get classes by student ID
   */
  static async GetClassesByStudent(
    studentId: number,
  ): Promise<GetClassesResponse> {
    const response = await httpClient.get<GetClassesResponse>(
      `/classes/of/student/${studentId}`,
    )
    return response.data
  }

  /**
   * Get class by ID
   */
  static async GetClassById(
    classId: number,
  ): Promise<{ success: boolean; data: Class }> {
    const response = await httpClient.get(`/classes/${classId}`)
    return response.data
  }

  /**
   * Get students of class
   */
  static async GetStudentsOfClass(classId: number): Promise<{
    class_id: number
    total_students: number
    students: Array<{ student_id: number; enrolled_at: Date }>
  }> {
    const response = await httpClient.get(`/classes/${classId}/students`)
    return response.data
  }

  /**
   * Add members to class
   */
  static async addMembers(data: AddMemberRequest): Promise<any> {
    const response = await httpClient.post(
        `/classes/add-students`,
      { students: data.students, class_id: data.classId },
    )
    return response.data
  }

  /**
   * Update class info
   */
  static async updateClass(
    classId: number,
    data: UpdateClassRequest,
  ): Promise<any> {
    const response = await httpClient.put(`/classes/${classId}`, data)
    return response.data
  }

  /**
   * Delete class
   */
  static async deleteClass(classId: number): Promise<any> {
    const response = await httpClient.delete(`/classes/${classId}`)
    return response.data
  }

  /**
   * Archive class
   */
  static async archiveClass(classId: number): Promise<any> {
    const response = await httpClient.post(`/classes/${classId}/archive`)
    return response.data
  }

  /**
   * Join class by code
   */
  static async joinClass(data: JoinClassRequest): Promise<any> {
    const response = await httpClient.post('/classes/join-by-code', data)
    return response.data
  }

  /**
   * Fetch user profiles by emails
   */
  static async getUsersByEmails(emails: string[]): Promise<User[]> {
    const response = await httpClient.post(
      '/users/get-list-profile-by-emails',
      { userEmails: emails },
    )
    return response.data.data?.users || []
  }
}
