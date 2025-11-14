import { useChatbot } from '../hooks'
import { 
  ChatMessageComponent, 
  ChatInput, 
  LoadingSpinner, 
  WelcomeScreen, 
  StreamingResponse 
} from '../components'
import '../styles/chat.css'
export function ChatbotPage() {
  const {
    messages,
    currentMessage,
    currentResponse,
    isProcessing,
    isStarting,
    endUserRef,
    endAiRef,
    spinnerRef,
    sendMessage,
    handleInputChange,
    handleKeyDown,
  } = useChatbot()

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
        <ChatInput
          value={currentMessage}
          onChange={handleInputChange}
          onSend={sendMessage}
          onKeyDown={handleKeyDown}
          disabled={isProcessing}
        />
      </div>
    </div>
  )
}