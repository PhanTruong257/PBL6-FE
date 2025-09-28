import React from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Download, Upload, MoreHorizontal } from 'lucide-react'

interface QuickActionsProps {
  onCreateLesson: () => void
  onImportLessons: () => void
  onExportLessons: () => void
  onBulkActions: () => void
  selectedCount?: number
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onCreateLesson,
  onImportLessons,
  onExportLessons,
  onBulkActions,
  selectedCount = 0
}) => {
  return (
    <div className="flex items-center gap-3">
      <Button 
        onClick={onCreateLesson}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Tạo bài học mới
      </Button>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={onImportLessons}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Import
        </Button>
        
        <Button
          variant="outline"
          onClick={onExportLessons}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>
      
      {selectedCount > 0 && (
        <Button
          variant="outline"
          onClick={onBulkActions}
          className="flex items-center gap-2"
        >
          <MoreHorizontal className="h-4 w-4" />
          Thao tác ({selectedCount})
        </Button>
      )}
    </div>
  )
}