import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { DeleteClassModal } from './delete-class-modal'
import { useState } from 'react'

interface ClassSettingsProps {
  allowStudentParticipation: boolean
  setAllowStudentParticipation: (value: boolean) => void
  showAttendanceScore: boolean
  setShowAttendanceScore: (value: boolean) => void
  allowDiscussion: boolean
  setAllowDiscussion: (value: boolean) => void
  sendEmailNotifications: boolean
  setSendEmailNotifications: (value: boolean) => void
  onBack: () => void
  changeColor: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export function ClassSettings({
  allowStudentParticipation,
  setAllowStudentParticipation,
  showAttendanceScore,
  setShowAttendanceScore,
  allowDiscussion,
  setAllowDiscussion,
  sendEmailNotifications,
  setSendEmailNotifications,
  onBack,
  changeColor
}: ClassSettingsProps) {
    const [isDeleteClassModalOpen, setDeleteClassModalOpen] = useState<boolean>(false);


    return (
        <div className="flex-1 p-6 overflow-y-auto bg-white">
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Class Information Section */}
            <div className="bg-indigo-500 rounded-lg p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded flex items-center justify-center">
                <span className="text-sm font-semibold">📚</span>
                </div>
                <h2 className="text-lg font-semibold">Thông tin lớp học</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                <label className="block text-sm font-medium mb-2">Tên lớp học *</label>
                <input
                    type="text"
                    placeholder="VD: Lập trình hướng đối tượng"
                    className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                />
                <p className="text-xs mt-1 opacity-80">Tên lớp sẽ hiển thị cho học sinh</p>
                </div>
                
                <div>
                <label className="block text-sm font-medium mb-2">Mã lớp *</label>
                <input
                    type="text"
                    maxLength={5}
                    placeholder="VD: CS101"
                    className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                />
                <p className="text-xs mt-1 opacity-80">Mã lớp duy nhất để học sinh tham gia</p>
                </div>
                
                <div className="md:col-span-1">
                <label className="block text-sm font-medium mb-2">Môn học</label>
                <select className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded text-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50" onChange={changeColor}>
                    <option className="text-gray-400" selected value="">Chọn môn học</option>
                    <option className="text-gray-900" value="01">OOP</option>
                    <option className="text-gray-900" value="02">Cấu trúc dữ liệu</option>
                </select>
                </div>
                
                <div className="md:col-span-1">
                <label className="block text-sm font-medium mb-2">Khối lớp</label>
                <select className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded text-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50" onChange={changeColor}>
                    <option className="text-gray-400" selected value="">Chọn khối</option>
                    <option className="text-gray-900" value="01">Khối 1</option>
                    <option className="text-gray-900" value="02">Khối 2</option>
                </select>
                </div>
            </div>
            
            <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Mô tả lớp học</label>
                <textarea
                placeholder="Mô tả ngắn gọn về nội dung và mục tiêu của lớp học..."
                rows={3}
                className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded text-black placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                />
            </div>
            </div>

            {/* Class Settings */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-indigo-100 rounded flex items-center justify-center">
                <span className="text-indigo-600 text-sm font-semibold">⚙️</span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Cài đặt lớp học</h2>
            </div>

            <div className="space-y-6">
                {/* Setting Items */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                    <h3 className="font-medium text-gray-900">Cho phép học sinh tự tham gia</h3>
                    <p className="text-sm text-gray-500">Học sinh có thể tham gia lớp không cần lời mời</p>
                </div>
                <Switch 
                    checked={allowStudentParticipation} 
                    onCheckedChange={setAllowStudentParticipation}
                />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                    <h3 className="font-medium text-gray-900">Hiển thị điểm số học sinh</h3>
                    <p className="text-sm text-gray-500">Học sinh có thể xem điểm của mình</p>
                </div>
                <Switch 
                    checked={showAttendanceScore} 
                    onCheckedChange={setShowAttendanceScore}
                />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                    <h3 className="font-medium text-gray-900">Cho phép thảo luận</h3>
                    <p className="text-sm text-gray-500">Học sinh có thể đăng bình luận và thảo luận</p>
                </div>
                <Switch 
                    checked={allowDiscussion} 
                    onCheckedChange={setAllowDiscussion}
                />
                </div>

                <div className="flex items-center justify-between py-3">
                <div>
                    <h3 className="font-medium text-gray-900">Thông báo email</h3>
                    <p className="text-sm text-gray-500">Gửi email thông báo về bài tập và kiểm tra mới</p>
                </div>
                <Switch 
                    checked={sendEmailNotifications} 
                    onCheckedChange={setSendEmailNotifications}
                />
                </div>
            </div>
            </div>

        
            {/* Action Buttons */}
            <div className="flex justify-between">
            <Button variant="outline" onClick={onBack}>
                Quay lại
            </Button>
            <div className="space-x-3">
                <Button variant="outline" onClick={()=>setDeleteClassModalOpen(true)}>
                Xóa lớp học
                </Button>
                <Button>
                Lưu thay đổi
                </Button>
            </div>
            </div>

            {/* Delete Class Modal */}
            <DeleteClassModal
            classId=''
            isOpen = {isDeleteClassModalOpen}
            onDeleteClass={((classId: string)=>{
                console.log(classId)
            })}
            onOpenChange={setDeleteClassModalOpen}
            classTitle='KTPM'
            >
            </DeleteClassModal>
        </div>
        </div>
    )
}