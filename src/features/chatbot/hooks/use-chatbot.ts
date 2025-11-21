import { useCallback, useEffect, useRef, useState } from 'react'
import type { ChatMessage, ChatbotState, UploadedFile } from '../types'
import { ChatbotApi } from '../apis'
export function useChatbot() {
  const [state, setState] = useState<ChatbotState>({
    messages: [],
    currentMessage: '',
    currentResponse: '',
    threadID: null,
    isProcessing: false,
    isStarting: true,
    uploadedFiles: [],
  })


  const [isFileVisibility, setFileVisibility] = useState<boolean>(true)
  const endUserRef = useRef<HTMLDivElement>(null)
  const endAiRef = useRef<HTMLDivElement>(null)
  const spinnerRef = useRef<HTMLDivElement>(null)

  // Initialize thread ID on mount
  useEffect(() => {
    if (!state.threadID) {
      const newThreadID = ChatbotApi.generateThreadID()
      setState(prev => ({ ...prev, threadID: newThreadID }))
    }
  }, [state.threadID])

  // Scroll to end when messages update
  const scrollToElement = useCallback((element: HTMLDivElement | null, delay = 100) => {
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'end' })
      }, delay)
    }
  }, [])

  const setCurrentMessage = useCallback((message: string) => {
    setState(prev => ({ ...prev, currentMessage: message }))
  }, [])

  const addUserMessage = useCallback((content: string, attachedFiles?: UploadedFile[]) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
      files: attachedFiles && attachedFiles.length > 0 ? [...attachedFiles] : undefined,
    }

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      currentMessage: '',
      isStarting: false,
    }))
  }, [])

  const addAiMessage = useCallback((content: string) => {
    const aiMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      role: 'ai',
      timestamp: new Date(),
    }

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, aiMessage],
      currentResponse: '',
      isProcessing: false,
    }))
  }, [])

  const updateCurrentResponse = useCallback((chunk: string) => {
    setState(prev => ({ ...prev, currentResponse: prev.currentResponse + chunk }))
    scrollToElement(endAiRef.current)
  }, [scrollToElement])

  const addFile = useCallback((file: File) => {
    const uploadedFile: UploadedFile = {
      file,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
    }
    
    setState(prev => ({
      ...prev,
      uploadedFiles: [...prev.uploadedFiles, uploadedFile]
    }))
  }, [])

  const removeFile = useCallback((fileId: string) => {
    setState(prev => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter(f => f.id !== fileId)
    }))
  }, [])

  const clearFiles = useCallback(() => {
    setState(prev => ({ ...prev, uploadedFiles: [] }))
  }, [])

  const sendMessage = useCallback(async (userId?: number, userRole?: string) => {
    const messageToSend = state.currentMessage.trim()
    if ((!messageToSend && state.uploadedFiles.length === 0) || !state.threadID) return

    // Add user message with attached files
    const displayMessage = messageToSend || `[Uploaded ${state.uploadedFiles.length} file(s)]`
    addUserMessage(displayMessage, state.uploadedFiles)

    // Start processing
    setState(prev => ({ ...prev, isProcessing: true, currentResponse: '' }))
    scrollToElement(spinnerRef.current)

    try {

      setFileVisibility(false)
      
      const response = await ChatbotApi.sendMessage({
        userMessage: messageToSend,
        threadID: state.threadID,
        files: state.uploadedFiles.map(f => f.file),
        user_id: userId || 1,
        user_role: userRole || 'student',
      })
      
      
      // Process streaming response
      const fullResponse = await ChatbotApi.processStreamingResponse(
        response,
        updateCurrentResponse
      )
      
      // Add AI response
      addAiMessage(fullResponse)
      
      // Clear files after sending
      setState(prev => ({ ...prev, uploadedFiles: [] }))
      setFileVisibility(true)
    } catch (error) {
      console.error('Error sending message:', error)
      
      // Add error message
      addAiMessage('Sorry, there was an error processing your message. Please try again.')
    }
  }, [
    state.currentMessage,
    state.threadID,
    state.uploadedFiles,
    addUserMessage,
    addAiMessage,
    updateCurrentResponse,
    scrollToElement,
  ])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMessage(e.target.value)
  }, [setCurrentMessage])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && state.currentMessage.trim()) {
      sendMessage()
    }
  }, [sendMessage, state.currentMessage])

  const resetChat = useCallback(() => {
    setState({
      messages: [],
      currentMessage: '',
      currentResponse: '',
      threadID: ChatbotApi.generateThreadID(),
      isProcessing: false,
      isStarting: true,
      uploadedFiles: [],
    })
  }, [])

  const handleFilesSelected = (files: File[]) => {
    files.forEach(file => addFile(file))
  }

  return {
    // State
    messages: state.messages,
    currentMessage: state.currentMessage,
    currentResponse: state.currentResponse,
    isProcessing: state.isProcessing,
    isStarting: state.isStarting,
    uploadedFiles: state.uploadedFiles,
    isFileVisibility,
    
    // Refs
    endUserRef,
    endAiRef,
    spinnerRef,
    
    // Actions
    sendMessage,
    handleInputChange,
    handleKeyDown,
    resetChat,
    setCurrentMessage,
    addFile,
    removeFile,
    clearFiles,
    handleFilesSelected,
  }
}