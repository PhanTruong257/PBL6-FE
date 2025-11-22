import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { CreatePostModal } from './create-post-modal'

interface StickyPostButtonProps {
  classInfo: {
    class_id: number
    class_name: string
  }
  onPostCreated?: () => void
}

export function StickyPostButton({
  classInfo,
  onPostCreated,
}: StickyPostButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      {/* Sticky Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-4 py-3 rounded-full h-auto text-sm font-medium"
          size="lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Post in channel
        </Button>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        classInfo={classInfo}
        onPostCreated={onPostCreated}
      />
    </>
  )
}
