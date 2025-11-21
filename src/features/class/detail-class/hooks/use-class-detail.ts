import { useQuery } from '@tanstack/react-query'
import type { Class } from '@/types/class'
import type { User } from '@/types'
import type { Material, Material_full_info } from '@/types/material'
import type { PostCardProps } from '../types'
import { cookieStorage } from '@/libs/utils/cookie'

const defaultUser: User = {
  user_id: 1,
  role: 'teacher',
  email: 'abc@gmail.com',
  isEmailVerified: true,
  status: 'active',
  createdAt: '',
  updatedAt: '',
}

export const fetchClassAllInfo = async (classId: string): Promise<Class> => {
  const token = cookieStorage.getAccessToken()
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/classes/${classId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!res.ok) {
    throw new Error('Failed to fetch class info')
  }

  const json = await res.json()
  // API returns { success, message, data }
  return json.data || json
}

export const fetchAllMaterials = async (
  classId: number,
): Promise<Material[]> => {
  const token = cookieStorage.getAccessToken()
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/materials/class/${classId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!res.ok) {
    throw new Error('Failed to fetch materials')
  }

  const json = await res.json()
  // API returns { success, message, data }
  return json.data || json
}

export const uploadMaterials = async (
  classId: number,
  files: File[],
  uploaderId: number,
  title?: string,
  postId?: number,
): Promise<any> => {
  const token = cookieStorage.getAccessToken()
  const formData = new FormData()

  // Append files
  files.forEach((file) => {
    formData.append('files', file)
  })

  // Append metadata
  formData.append('classId', classId.toString())
  formData.append('uploaderId', uploaderId.toString())
  if (title) {
    formData.append('title', title)
  }
  if (postId) {
    formData.append('postId', postId.toString())
  }

  const res = await fetch(`${import.meta.env.VITE_API_URL}/materials/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!res.ok) {
    throw new Error('Failed to upload materials')
  }

  return res.json()
}

export const downloadMaterial = async (filename: string): Promise<Blob> => {
  const token = cookieStorage.getAccessToken()
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/materials/download/${filename}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!res.ok) {
    throw new Error('Failed to download material')
  }

  return res.blob()
}

export const deleteMaterial = async (materialId: number): Promise<any> => {
  const token = cookieStorage.getAccessToken()
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/materials/${materialId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!res.ok) {
    throw new Error('Failed to delete material')
  }

  return res.json()
}

export const fetchUserProfileFromIds = async (
  userIds: number[],
): Promise<User[]> => {
  const token = cookieStorage.getAccessToken()
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/users/get-list-profile-by-ids`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userIds,
      }),
    },
  )

  if (!res.ok) {
    throw new Error('Failed to fetch user profiles')
  }

  const json = await res.json()
  // Backend returns { data: { users: [...] } }
  return json.data?.users || []
}

export function useClassDetail(classId: string) {
  return useQuery({
    queryKey: ['class', classId],
    queryFn: async () => {
      const classAllInfo = await fetchClassAllInfo(classId)

      const classInfo = {
        class_id: classAllInfo.class_id,
        class_name: classAllInfo.class_name,
        class_code: classAllInfo.class_code,
        teacher_id: classAllInfo.teacher_id,
        description: classAllInfo.description,
        created_at: classAllInfo.created_at,
        updated_at: classAllInfo.updated_at,
      }

      const userIds = new Set<number>()
      const postDict = new Map<number, any>()
      const replyDict = new Map<number, any[]>()

      for (let post of classAllInfo.posts) {
        if (post.parent_id) {
          // Reply: group by parent_id
          if (!replyDict.has(post.parent_id)) replyDict.set(post.parent_id, [])
          replyDict.get(post.parent_id)?.push(post)
        } else {
          // Main post: use post.id as key
          postDict.set(post.id, post)
        }
        userIds.add(post.sender_id)
      }

      const userIdsList = [...userIds]

      // Only fetch user profiles if there are posts
      let userInfoList: User[] = []
      if (userIdsList.length > 0) {
        userInfoList = await fetchUserProfileFromIds(userIdsList)
      }

      const userDict = new Map<number, User>()

      for (let i = 0; i < userIdsList.length; i++) {
        userDict.set(userIdsList[i], userInfoList[i])
      }

      const formattedPostData: PostCardProps[] = []
      for (let [postId, post] of postDict) {
        let replies = replyDict.has(postId) ? replyDict.get(postId) : []
        let formattedReplies: PostCardProps[] = replies
          ? replies.map((reply) => ({
              id: reply.id,
              sender: userDict.get(reply.sender_id) || defaultUser,
              title: '',
              message: reply.message,
              created_at: new Date(reply.created_at),
              replies: [],
              materials: reply.materials || [],
            }))
          : []

        formattedPostData.push({
          id: post.id,
          sender: userDict.get(post.sender_id) || defaultUser,
          title: post.title,
          message: post.message,
          created_at: new Date(post.created_at),
          replies: formattedReplies,
          materials: post.materials || [],
        })
      }

      return { classInfo, formattedPostData }
    },
  })
}

export function useMaterialsDetail(classId: number) {
  return useQuery({
    queryKey: ['materials', classId],
    queryFn: async () => {
      const materials = await fetchAllMaterials(classId)

      // Collect all unique user IDs from materials
      const userIds = new Set<number>()
      for (let material of materials) {
        userIds.add(material.uploaded_by)
      }

      const userIdsList = [...userIds]

      // Only fetch user profiles if there are materials
      let userInfoList: User[] = []
      if (userIdsList.length > 0) {
        userInfoList = await fetchUserProfileFromIds(userIdsList)
      }

      const userDict = new Map<number, User>()

      for (let i = 0; i < userIdsList.length; i++) {
        userDict.set(userIdsList[i], userInfoList[i])
      }

      const materials_full_info: Material_full_info[] = materials.map(
        (material) => ({
          ...material,
          uploaded_by: userDict.get(material.uploaded_by) || defaultUser,
        }),
      )

      return materials_full_info
    },
  })
}
