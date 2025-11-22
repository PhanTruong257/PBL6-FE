import { httpClient } from '@/libs/http'

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

/**
 * Class Service - API calls for class management
 */
export const ClassService = {
  /**
   * Create a new class
   */
  async CreateClass(data: CreateClassRequest): Promise<CreateClassResponse> {
    console.log('📤 Sending create class request:', data)
    const response = await httpClient.post<CreateClassResponse>(
      '/classes/create',
      data,
    )
    console.log('📥 Received response:', response)
    console.log('📦 Response data:', response.data)
    return response.data
  },

  /**
   * Get all classes
   */
  async GetAllClasses(): Promise<GetClassesResponse> {
    const response = await httpClient.get<GetClassesResponse>('/classes')
    return response.data
  },

  /**
   * Get classes by teacher ID
   */
  async GetClassesByTeacher(teacherId: number): Promise<GetClassesResponse> {
    const response = await httpClient.get<GetClassesResponse>(
      `/classes/of/teacher/${teacherId}`,
    )
    return response.data
  },

  /**
   * Get classes by student ID
   */
  async GetClassesByStudent(studentId: number): Promise<GetClassesResponse> {
    const response = await httpClient.get<GetClassesResponse>(
      `/classes/of/student/${studentId}`,
    )
    return response.data
  },

  /**
   * Get class by ID
   */
  async GetClassById(
    classId: number,
  ): Promise<{ success: boolean; data: Class }> {
    const response = await httpClient.get(`/classes/${classId}`)
    return response.data
  },

  /**
   * Update class
   */
  async UpdateClass(
    classId: number,
    data: Partial<CreateClassRequest>,
  ): Promise<CreateClassResponse> {
    const response = await httpClient.put<CreateClassResponse>(
      `/classes/${classId}`,
      data,
    )
    return response.data
  },

  /**
   * Delete class
   */
  async DeleteClass(
    classId: number,
  ): Promise<{ success: boolean; message: string }> {
    const response = await httpClient.delete(`/classes/${classId}`)
    return response.data
  },

  /**
   * Get students of class
   */
  async GetStudentsOfClass(classId: number): Promise<{
    class_id: number
    total_students: number
    students: Array<{ student_id: number; enrolled_at: Date }>
  }> {
    const response = await httpClient.get(`/classes/${classId}/students`)
    return response.data
  },
}
