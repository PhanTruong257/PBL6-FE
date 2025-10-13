import { createFileRoute, useParams } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ClassSettings, ClassMainContent, AddMemberModal } from '@/components/class'
import { 
  MoreHorizontal, 
  Pin, 
  Settings,
  UserPlus
} from 'lucide-react'
import type { Class } from '@/types/class'
import type { User } from '@/types'

const user: User={
  user_id: '1',
  role: 'teacher',
  fullName: 'abc',
  email:"abc@gmail.com",
  isEmailVerified:true,
  status:'active',
  createdAt: '',
  updatedAt: '',
}

const fetchClassAllInfo = async (classId: string): Promise<Class> =>{
  const res = await fetch(`${import.meta.env.VITE_API_URL}/classes/${classId}`);
  const json = await res.json();
  return json;
}

const fetchAllClassOfUser = async (user: User): Promise<Class>=>{
  const res = await fetch(`${import.meta.env.VITE_API_URL}/classes/of/${user.role}/${user.user_id}`);
  const json = await res.json();
  return json;
}

export const Route = createFileRoute('/class/$classId')({
  // loader:async ({params:{classId} })=> Promise.all([fetchAllClassOfUser(user), fetchClassAllInfo(classId)]),
  component: RouteComponent,
})

function RouteComponent() {

  // const  loaderData = Route.useLoaderData();
  // const  allClassInfoOfUser = loaderData[0];
  // const classAllInfo = loaderData[1];
  const classAllInfo = {
    class_name: 'mocktest class',
    class_code: 'abcds',
    class_id:1234,
    teacher_id: 123,
    description:'class for mocktest',
    created_at: new Date(),
    updated_at: new Date()
  }

  const [activeTab, setActiveTab] = useState('posts')
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-lg">KT</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">KTPM 22NH11</h1>
              <p className="text-sm text-gray-500">Class</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              Confidential
            </Badge>
            <Button variant="ghost" size="icon" onClick={() => setIsAddMemberModalOpen(true)}>
              <UserPlus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)}>
              <Settings className="h-4 w-4" />
            </Button>
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
