import { useDeleteLesson, useTogglePublishLesson, useReorderLessons } from './useLessons'
import { useAppStore } from '@/store'

export const useLessonActions = () => {
  const { addNotification } = useAppStore()
  const deleteLesson = useDeleteLesson()
  const togglePublish = useTogglePublishLesson()
  const reorderLessons = useReorderLessons()

  const handleDeleteLesson = async (id: string, title: string) => {
    try {
      await deleteLesson.mutateAsync(id)
      addNotification({
        type: 'success',
        title: 'Bài học đã được xóa',
        message: `Bài học "${title}" đã được xóa thành công.`,
      })
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Lỗi xóa bài học',
        message: 'Không thể xóa bài học. Vui lòng thử lại.',
      })
    }
  }

  const handleTogglePublish = async (id: string, isPublished: boolean, title: string) => {
    try {
      await togglePublish.mutateAsync({ id, isPublished })
      addNotification({
        type: 'success',
        title: isPublished ? 'Bài học đã được xuất bản' : 'Bài học đã được ẩn',
        message: `Bài học "${title}" đã được ${isPublished ? 'xuất bản' : 'ẩn'} thành công.`,
      })
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Lỗi cập nhật bài học',
        message: 'Không thể cập nhật trạng thái bài học. Vui lòng thử lại.',
      })
    }
  }

  const handleReorderLessons = async (lessons: { id: string; order: number }[]) => {
    try {
      await reorderLessons.mutateAsync(lessons)
      addNotification({
        type: 'success',
        title: 'Đã cập nhật thứ tự bài học',
        message: 'Thứ tự các bài học đã được cập nhật thành công.',
      })
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Lỗi sắp xếp bài học',
        message: 'Không thể cập nhật thứ tự bài học. Vui lòng thử lại.',
      })
    }
  }

  return {
    handleDeleteLesson,
    handleTogglePublish,
    handleReorderLessons,
    isDeleting: deleteLesson.isPending,
    isToggling: togglePublish.isPending,
    isReordering: reorderLessons.isPending,
  }
}