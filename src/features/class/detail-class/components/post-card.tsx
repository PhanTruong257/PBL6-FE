import { Card, CardContent } from '@/components/ui/card'
import type { User } from '@/types'
import { useState } from 'react'
import { replyInput } from './reply-input'
import { AvatarHoverCard } from './avatar-hover-card'
import type { PostCardProps } from '../types'
import { File, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { downloadMaterial } from '../hooks/use-class-detail'

export function PostCard({
  id,
  sender,
  title,
  message,
  created_at,
  replies,
  materials,
  classId,
  onRefresh,
}: PostCardProps & { classId: number; onRefresh?: () => void }) {
  const [hideReply, setHideReply] = useState<boolean>(true)

  const handleDownloadFile = async (fileUrl: string, fileName: string) => {
    try {
      const filename = fileUrl.split('/').pop() || fileName
      const blob = await downloadMaterial(filename)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download file:', error)
      alert('Không thể tải file. Vui lòng thử lại!')
    }
  }
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <AvatarHoverCard
            user={sender}
            placeHolder="/placeholder-avatar.jpg"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-semibold text-gray-900">
                {sender.email}
              </span>
              <span className="text-sm text-gray-500">
                {created_at.toLocaleDateString() +
                  ' ' +
                  created_at.toLocaleTimeString()}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-800 mb-3">{message}</p>

            {/* Materials/Files */}
            {materials && materials.length > 0 && (
              <div className="mb-4 space-y-2">
                {materials.map((material) => (
                  <div
                    key={material.material_id}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() =>
                      handleDownloadFile(material.file_url, material.title)
                    }
                  >
                    <File className="h-5 w-5 text-gray-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 truncate">
                        {material.title}
                      </div>
                      {material.file_size && (
                        <div className="text-xs text-gray-500">
                          {(material.file_size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      )}
                    </div>
                    <Download className="h-5 w-5 text-gray-600 flex-shrink-0" />
                  </div>
                ))}
              </div>
            )}

            {replies && replies.length > 0 && (
              <div
                className="text-sm text-blue-600 mb-4"
                onClick={() => {
                  setHideReply(!hideReply)
                }}
              >
                <a className="no-underline hover:underline cursor-pointer">
                  {replies.length} replies for this post
                </a>
              </div>
            )}

            {/* Replies */}
            {!hideReply &&
              replies &&
              replies.map((reply, index) => (
                <div
                  key={index}
                  className="ml-4 border-l-2 border-gray-200 pl-4 mb-4"
                >
                  <div className="flex items-start space-x-3">
                    <AvatarHoverCard
                      user={reply.sender}
                      placeHolder="/placeholder-avatar.jpg"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900 text-sm">
                          {reply.sender.email}
                        </span>
                        <span className="text-xs text-gray-500">
                          {reply.created_at.toLocaleDateString() +
                            ' ' +
                            reply.created_at.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 mb-2">
                        {reply.message}
                      </p>

                      {/* Reply Materials/Files */}
                      {reply.materials && reply.materials.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {reply.materials.map((material) => (
                            <div
                              key={material.material_id}
                              className="flex items-center gap-2 p-2 rounded-lg border bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
                              onClick={() =>
                                handleDownloadFile(
                                  material.file_url,
                                  material.title,
                                )
                              }
                            >
                              <File className="h-4 w-4 text-blue-600 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm text-gray-900 truncate">
                                  {material.title}
                                </div>
                                {material.file_size && (
                                  <div className="text-xs text-gray-500">
                                    {(material.file_size / 1024 / 1024).toFixed(
                                      2,
                                    )}{' '}
                                    MB
                                  </div>
                                )}
                              </div>
                              <Download className="h-4 w-4 text-blue-600 flex-shrink-0" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

            <div className="flex items-center space-x-4 mt-4">
              {replyInput({
                classId,
                postId: id,
                replies: replies || [],
                onReplyAdded: onRefresh,
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
