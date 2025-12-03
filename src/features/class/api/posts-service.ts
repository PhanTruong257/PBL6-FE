import { httpClient } from '@/libs/http'

export interface CreatePostRequest {
  class_id: number
  parent_id?: number
  message: string
  title?: string
  sender_id: number
}

export interface CreatePostResponse {
  data: {
    id: number
    class_id: number
    parent_id?: number
    message: string
    title?: string
    sender_id: number
    created_at: string
  }
}

export interface UploadMaterialsRequest {
  classId: number
  files: File[]
  uploaderId: number
  title?: string
  postId?: number
}

export class PostsService {
  /**
   * Create a new post or reply
   */
  static async createPost(
    data: CreatePostRequest,
  ): Promise<CreatePostResponse> {
    const response = await httpClient.post('/classes/add-new-post', data)
    return response.data
  }

  /**
   * Upload materials (files) for a post
   */
  static async uploadMaterials(data: UploadMaterialsRequest): Promise<any> {
    const formData = new FormData()

    // Append files
    data.files.forEach((file) => {
      formData.append('files', file)
    })

    // Append metadata
    formData.append('classId', data.classId.toString())
    formData.append('uploaderId', data.uploaderId.toString())
    if (data.title) {
      formData.append('title', data.title)
    }
    if (data.postId) {
      formData.append('postId', data.postId.toString())
    }

    const response = await httpClient.post('/materials/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  }
}
