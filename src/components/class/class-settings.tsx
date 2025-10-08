import { Button } from '@/components/ui/button'
import { DeleteClassModal } from './delete-class-modal'
import { useState } from 'react'
import type { ClassBasicInfo } from '@/types/class';

interface ClassSettingsProps {
  onBack: () => void,
  classInfo: ClassBasicInfo
}

export function ClassSettings({
  onBack,
  classInfo,
}: ClassSettingsProps) {
    const [isDeleteClassModalOpen, setDeleteClassModalOpen] = useState<boolean>(false);
    const [className, setClassName] = useState<string>(classInfo.class_name)
    const [classCode, setClassCode] = useState<string>(classInfo.class_code)
    const [classDescription, setClassDescription] = useState<string>(classInfo.description||'')
    const handleDeleteClass = async (classId: string)=>{
                
        const res = await fetch(`${import.meta.env.VITE_API_URL}/classes/${classId}`,{
            method:'DELETE',
            headers:{
                authorization:'' 
            }
        })
        const json = res.json();
        console.log('Delete class ' + classId + ' response ' + json);
    }

    const handleUpdateClass = async (className: string, classCode: string, classDes: string) =>{
        const updatedClass = {
            class_name:className,
            class_code:classCode,
            description: classDes,
            teacher_id: classInfo.teacher_id
        };

        const res = await fetch(`${import.meta.env.VITE_API_URL}/classes/${classInfo.class_id}`,{
            method:'PUT',
            headers:{
                authorization:''
            },
            body: JSON.stringify(updatedClass),
        });
        const json = res.json();

        console.log('Update class successfully' + ' reponse ' + json);
    }

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
                    value={className}
                    onChange={(e)=>setClassName(e.target.value)}
                />
                {className.length <= 0 && <p className="text-xs mt-1 text-red-600 opacity-80">Tên lớp không được bỏ trống</p>}
                </div>
                
                <div>
                <label className="block text-sm font-medium mb-2">Mã lớp *</label>
                <input
                    type="text"
                    maxLength={5}
                    placeholder="VD: CS101"
                    className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                    value={classCode}
                    onChange={(e)=>setClassCode(e.target.value)}
                    
                />
                {classCode.length!=5 && <p className="text-xs mt-1 text-red-600 opacity-80">Mã lớp học phải có đúng 5 ký tự</p>}
                </div>
            </div>
            
            <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Mô tả lớp học</label>
                <textarea
                placeholder="Mô tả ngắn gọn về nội dung và mục tiêu của lớp học..."
                rows={3}
                className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded text-black placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                value={classDescription}
                onChange={(e)=>setClassDescription(e.target.value)}
                />
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
                {classCode.length==5 && className.length>0 ?  
                <Button onClick={()=>handleUpdateClass}>
                Lưu thay đổi
                </Button>
                :
                <Button disabled>
                Lưu thay đổi
                </Button>
                }
            </div>
            </div>

            {/* Delete Class Modal */}
            <DeleteClassModal
            classId=''
            isOpen = {isDeleteClassModalOpen}
            onDeleteClass={handleDeleteClass}
            onOpenChange={setDeleteClassModalOpen}
            classTitle={classInfo.class_name}
            >
            </DeleteClassModal>
        </div>
        </div>
    )
}