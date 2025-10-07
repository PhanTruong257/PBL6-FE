import { createFileRoute } from '@tanstack/react-router'
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

export const Route = createFileRoute('/teacher/dashboard/class/$classId')({
  component: RouteComponent,
})

function RouteComponent() {
  const [activeTab, setActiveTab] = useState('posts')
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  
  // Settings state
  const [allowStudentParticipation, setAllowStudentParticipation] = useState(true)
  const [showAttendanceScore, setShowAttendanceScore] = useState(true)
  const [allowDiscussion, setAllowDiscussion] = useState(false)
  const [sendEmailNotifications, setSendEmailNotifications] = useState(true)

  const handleAddMember = (email: string) => {
    // Handle adding member logic here
    console.log('Adding member to class:', email)
    // You can add API call here
  }

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
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          <div className="space-y-4">
            {/* Pinned Section */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Pin className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Pinned</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">G</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">General</p>
                    <p className="text-xs text-gray-500">Actium Corporation</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Your teams Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Your teams</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-orange-50 cursor-pointer">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">KT</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">KTPM</p>
                  </div>
                </div>
                <div className="ml-11 space-y-1">
                  <div className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer py-1">General</div>
                  <div className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer py-1">Material</div>
                </div>
                
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">SOA</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">SOA</p>
                  </div>
                </div>
                <div className="ml-11 space-y-1">
                  <div className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer py-1">General</div>
                  <div className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer py-1">Material</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {showSettings ? (
            <ClassSettings
              allowStudentParticipation={allowStudentParticipation}
              setAllowStudentParticipation={setAllowStudentParticipation}
              showAttendanceScore={showAttendanceScore}
              setShowAttendanceScore={setShowAttendanceScore}
              allowDiscussion={allowDiscussion}
              setAllowDiscussion={setAllowDiscussion}
              sendEmailNotifications={sendEmailNotifications}
              setSendEmailNotifications={setSendEmailNotifications}
              onBack={() => setShowSettings(false)}
              changeColor={( (e)=> {
                var element = e.target;
                // console.log(element); 
                element.classList.toggle('text-gray-400', element.value === '');
                element.classList.toggle('text-gray-900', element.value !== '');
              } )}
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
        classTitle="Group KTPM 22NH11"
        onAddMember={handleAddMember}
      />
    </div>
  )
}
