import { useQuery } from '@tanstack/react-query'
import type { Class } from '@/types/class'
import type { User } from '@/types'
import type { PostCardProps } from '../types'

const defaultUser: User = {
    user_id: 1,
    role: 'teacher',
    email: "abc@gmail.com",
    isEmailVerified: true,
    status: 'active',
    createdAt: '',
    updatedAt: '',
}

export const fetchClassAllInfo = async (classId: string): Promise<Class> => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/classes/${classId}`)
    const json = await res.json()
    return json
}

export const fetchUserProfileFromIds = async (userIds: number[]): Promise<User[]> => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/users/get-list-profile-by-ids`, {
        method: 'POST',
        body: JSON.stringify({
            userIds
        })
    })
    const json = await res.json()
    return json
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
                updated_at: classAllInfo.updated_at
            }

            const userIds = new Set<number>()
            const postDict = new Map<number, any>()
            const replyDict = new Map<number, any[]>()

            for (let post of classAllInfo.posts) {
                if (post.parent_id) {
                    if (!replyDict.has(post.id)) replyDict.set(post.id, [])
                    replyDict.get(post.id)?.push(post)
                } else {
                    postDict.set(post.id, post)
                }
                userIds.add(post.sender_id)
            }

            const userIdsList = [...userIds]
            const userInfoList = await fetchUserProfileFromIds(userIdsList)
            const userDict = new Map<number, User>()

            for (let i = 0; i < userIdsList.length; i++) {
                userDict.set(userIdsList[i], userInfoList[i])
            }

            const formattedPostData: PostCardProps[] = []
            for (let [postId, post] of postDict) {
                let replies = replyDict.has(postId) ? replyDict.get(postId) : []
                let formattedReplies: PostCardProps[] = replies ? replies.map((reply) => ({
                    id: reply.id,
                    sender: userDict.get(reply.sender_id) || defaultUser,
                    message: reply.message,
                    create_at: new Date(reply.created_at),
                    replies: [],
                })) : []

                formattedPostData.push({
                    id: post.id,
                    sender: userDict.get(post.sender_id) || defaultUser,
                    message: post.message,
                    create_at: new Date(post.created_at),
                    replies: formattedReplies,
                })
            }

            return { classInfo, formattedPostData }
        },
    })
}