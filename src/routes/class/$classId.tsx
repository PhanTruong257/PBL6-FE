import { createFileRoute, useParams } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ClassSettings, ClassMainContent, AddMemberModal } from '@/components/class'
import { 
  MoreHorizontal, 
  Settings,
  UserPlus
} from 'lucide-react'
import type { Class, ClassBasicInfo } from '@/types/class'
import type { User } from '@/types'
import type { Post } from '@/types/post'
import type { PostCardProps } from '@/components/class/post-card'

// ---------------------------------------------------------------------------------------------------
const defaultUser: User={
  user_id: 1,
  role: 'teacher',
  email:"abc@gmail.com",
  isEmailVerified:true,
  status:'active',
  createdAt: '',
  updatedAt: '',
}
// login user
const user: User={
  user_id: 1,
  role: 'teacher',
  email:"abc@gmail.com",
  isEmailVerified:true,
  status:'active',
  createdAt: '',
  updatedAt: '',
}
// const POSTS_DATA = [
//   {
//     id: 1,
//     sender: defaultUser,
//     create_at: new Date(),
//     message: 'Thầy gửi các em mẫu SRS như sau, với các yêu cầu...',
//     replies: [
//       {
//         id: 2,
//         sender: defaultUser,
//         create_at: new Date(),
//         message: 'Thầy gửi các em mẫu SRS như sau, với các yêu cầu...',
//         replies: []
//       },
//       {
//         id: 3,
//         sender: defaultUser,
//         create_at: new Date(),
//         message: 'Thầy gửi các em mẫu SRS như sau, với các yêu cầu...',
//         replies: []
//       },
//       {
//         id: 4,
//         sender: defaultUser,
//         create_at: new Date(),
//         message: 'Thầy gửi các em mẫu SRS như sau, với các yêu cầu...',
//         replies: []
//       }
//     ]
//   },
//   {
//     id: 5,
//     sender: defaultUser,
//     create_at: new Date(),
//     message: 'Thầy gửi các em mẫu SRS như sau, với các yêu cầu...',
//     replies: [
//       {
//         id: 6,
//         sender: defaultUser,
//         create_at: new Date(),
//         message: 'Thầy gửi các em mẫu SRS như sau, với các yêu cầu...',
//         replies: []
//       },
//       {
//         id: 7,
//         sender: defaultUser,
//         create_at: new Date(),
//         message: 'Thầy gửi các em mẫu SRS như sau, với các yêu cầu...',
//         replies: []
//       },
//       {
//         id: 8,
//         sender: defaultUser,
//         create_at: new Date(),
//         message: 'Thầy gửi các em mẫu SRS như sau, với các yêu cầu...',
//         replies: []
//       }
//     ]
//   }
// ]
// const CLASS_ALL_INFO = {
//     class_name: 'mocktest class',
//     class_code: 'abcds',
//     class_id:1234,
//     teacher_id: 123,
//     description:'class for mocktest',
//     created_at: new Date(),
//     updated_at: new Date()
//   }
// ---------------------------------------------------------------------------------------------------
const fetchClassAllInfo = async (classId: string): Promise<Class> =>{
  const res = await fetch(`${import.meta.env.VITE_API_URL}/classes/${classId}`);
  const json = await res.json();
  return json;
}

const fetchUserProfileFromIds = async (userIds:number[]): Promise<User[]> =>{
  const res = await fetch(`${import.meta.env.VITE_API_URL}/users/get-list-profile-by-ids`,{
    method: 'POST',
    body:JSON.stringify({
      userIds
    })
  });
  const json = await res.json();
  return json;
}


export const Route = createFileRoute('/class/$classId')({
  loader:async ({params:{classId} })=> {
    const classAllInfo = await fetchClassAllInfo(classId);
    const classInfo:ClassBasicInfo = {
      class_id:classAllInfo.class_id,
      class_name:classAllInfo.class_name,
      class_code:classAllInfo.class_code,
      teacher_id:classAllInfo.teacher_id,
      description:classAllInfo.description,
      created_at:classAllInfo.created_at,
      updated_at:classAllInfo.updated_at
    }
    const userIds = new Set<number>()
    const postDict = new Map<number, Post>();
    const replyDict = new Map<number,Post[]>();
    for (let post of classAllInfo.posts){
      if (post.parent_id){
        if (!replyDict.has(post.id)) replyDict.set(post.id, [])
        replyDict.get(post.id)?.push(post)
      } else {
        postDict.set(post.id, post)
      }
      userIds.add(post.sender_id)
    }
    const userIdsList = [...userIds];
    const userInfoList = await fetchUserProfileFromIds(userIdsList)
    const userDict = new Map<number, User>()
    for (let i = 0; i<userIdsList.length; i++){
      userDict.set(userIdsList[i], userInfoList[i])
    }
    const formattedPostData:PostCardProps[] = []
    for (let [postId, post] of postDict){
      let replies = replyDict.has(postId)?replyDict.get(postId):[]
      let formattedReplies:PostCardProps[]= replies?replies.map((reply)=>({
        id: reply.id,
        sender: userDict.get(reply.sender_id)||defaultUser,
        message: reply.message,
        create_at: reply.created_at,
        replies: [],
      })):[];
      formattedPostData.push({
        id: post.id,
        sender: userDict.get(post.sender_id)||defaultUser,
        message: post.message,
        create_at: post.created_at,
        replies: formattedReplies,
      })
    }
    return {classInfo, formattedPostData}
  },
  component: RouteComponent,
})

function RouteComponent() {

  const  loaderData = Route.useLoaderData();
  const classAllInfo = loaderData.classInfo;
  const postData = loaderData.formattedPostData;
  // const classAllInfo = CLASS_ALL_INFO;
  // const postData = POSTS_DATA;
  

  const [activeTab, setActiveTab] = useState('posts')
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const isTeacher = (user.role === 'teacher');


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-lg">{classAllInfo.class_name.substring(0,2)}</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{classAllInfo.class_name}</h1>
              <p className="text-sm text-gray-500">Class</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {
            isTeacher&&
            <Button variant="ghost" size="icon" onClick={() => setIsAddMemberModalOpen(true)}>
              <UserPlus className="h-4 w-4" />
            </Button>
            }
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            {
            isTeacher&&
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)}>
              <Settings className="h-4 w-4" />
            </Button>
            }
          </div>
        </div>
      </div>

      <div className="flex h-full">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {showSettings ? (
            <ClassSettings
              onBack={() => setShowSettings(false)}
              classInfo={{
                class_id: classAllInfo.class_id,
                class_code: classAllInfo.class_code,
                class_name: classAllInfo.class_name,
                teacher_id: classAllInfo.teacher_id,
                description: classAllInfo.description,
                created_at: classAllInfo.created_at,
                updated_at: classAllInfo.updated_at,
              }}
            />
          ) : (
            <ClassMainContent
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              postData={postData}
            />
          )}
        </div>
      </div>

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onOpenChange={setIsAddMemberModalOpen}
        classInfo={{
          class_id: classAllInfo.class_id,
          class_code: classAllInfo.class_code,
          class_name: classAllInfo.class_name,
          teacher_id: classAllInfo.teacher_id,
          description: classAllInfo.description,
          created_at: classAllInfo.created_at,
          updated_at: classAllInfo.updated_at,
        }}
      />
    </div>
  )
}
