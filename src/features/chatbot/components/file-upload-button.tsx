import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Paperclip } from 'lucide-react'

interface FileUploadButtonProps {
  onFilesSelected: (files: File[]) => void
  disabled?: boolean
  multiple?: boolean
}

export function FileUploadButton({ 
  onFilesSelected, 
  disabled = false, 
  multiple = true 
}: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      onFilesSelected(Array.from(files))
    }
    // Reset input to allow selecting the same file again
    if (event.target) {
      event.target.value = ''
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleButtonClick}
        disabled={disabled}
        className="text-gray-600 hover:text-gray-900 hover:bg-gray-200 p-2"
      >
        <Paperclip className="h-4 w-4" />
      </Button>
      
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        className="hidden"
        onChange={handleFileChange}
        accept="*/*"
        disabled={disabled}
      />
    </>
  )
}