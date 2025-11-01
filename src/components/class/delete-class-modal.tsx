import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

interface DeleteClassModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  classTitle?: string
  onDeleteClass: (classId: string) => void
  classId: string
}

export function DeleteClassModal({ 
  isOpen, 
  onOpenChange, 
  classTitle = "Group KTPM",
  onDeleteClass,
  classId
}: DeleteClassModalProps) {

    const handleDeleteClass = () =>{
        onDeleteClass(classId)
    }

    const handleClose = () => {
        onOpenChange(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
                Delete {classTitle}
            </DialogTitle>
            </DialogHeader>
            <div className="py-4">
            <p className="text-sm text-gray-600 mb-4">
                Are you sure to delete {classTitle} ?
            </p>
            
            </div>
            <DialogFooter className="flex justify-end space-x-2">
            <Button 
                variant="outline" 
                onClick={handleClose}
            >
                Cancel
            </Button>
            <Button 
                onClick={handleDeleteClass}
            >
                Delete
            </Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>
    )
}