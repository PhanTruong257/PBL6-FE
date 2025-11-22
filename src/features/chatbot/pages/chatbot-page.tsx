import { useChatbot } from '../hooks'
import { 
  ChatMessageComponent, 
  ChatInput, 
  LoadingSpinner, 
  WelcomeScreen, 
  StreamingResponse,
  FileDisplay
} from '../components'
import { cookieStorage } from '@/libs/utils'
import '../styles/chat.css'
import type { User } from '@/types'
export function ChatbotPage() {
  const {
    messages,
    currentMessage,
    currentResponse,
    isProcessing,
    isStarting,
    isFileVisibility,
    endUserRef,
    endAiRef,
    spinnerRef,
    uploadedFiles,
    sendMessage,
    handleInputChange,
    handleKeyDown,
    addFile,
    removeFile,
    handleFilesSelected,
  } = useChatbot()
  const userData = cookieStorage.getUser() as User
  
  return (
    <div className="chatbot-container flex flex-col">
      {isStarting ? (
        <div className="welcome-screen">
          <WelcomeScreen />
        </div>
      ) : (
        <div className="chatbot-messages flex-1 flex flex-col p-3 gap-2 bg-grey w-full max-w-2xl mx-auto items-center">
          {messages.map((message, index) => (
            <ChatMessageComponent
              key={message.id || index}
              message={message}
              isLast={index === messages.length - 1}
              messageRef={index === messages.length - 1 ? endUserRef : undefined}
            />
          ))}

          <StreamingResponse 
            content={currentResponse}
            aiRef={endAiRef}
          />

          {!currentResponse.trim() && isProcessing && (
            <LoadingSpinner spinnerRef={spinnerRef} />
          )}
        </div>
      )}

      <div className="flex-shrink-0 p-4">
        {/* Display uploaded files */}
        {uploadedFiles.length > 0 && (
          <div className="mb-4 max-w-2xl mx-auto">
            <FileDisplay
              files={uploadedFiles}
              onRemoveFile={removeFile}
              isFileVisibility={isFileVisibility}
              disabled={isProcessing}
            />
          </div>
        )}

        <ChatInput
          value={currentMessage}
          onChange={handleInputChange}
          onSend={()=>sendMessage(userData.user_id, userData.role)}
          onKeyDown={handleKeyDown}
          disabled={isProcessing}
          onFilesSelected={handleFilesSelected}
          hasFiles={uploadedFiles.length > 0}
        />
      </div>
    </div>
  )
}