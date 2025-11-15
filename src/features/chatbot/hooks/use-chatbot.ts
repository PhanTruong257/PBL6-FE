import { useCallback, useEffect, useRef, useState } from 'react'
import type { ChatMessage, ChatbotState } from '../types'
import { ChatbotApi } from '../apis'

export function useChatbot() {
  const [state, setState] = useState<ChatbotState>({
    messages: [],
    currentMessage: '',
    currentResponse: '',
    threadID: null,
    isProcessing: false,
    isStarting: true,
  })

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
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, delay)
    }
  }, [])

  const setCurrentMessage = useCallback((message: string) => {
    setState(prev => ({ ...prev, currentMessage: message }))
  }, [])

  const addUserMessage = useCallback((content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
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

  const sendMessage = useCallback(async () => {
    const messageToSend = state.currentMessage.trim()
    if (!messageToSend || !state.threadID) return

    // Add user message
    addUserMessage(messageToSend)

    // Start processing
    setState(prev => ({ ...prev, isProcessing: true, currentResponse: '' }))
    scrollToElement(spinnerRef.current)

    try {
      const response = await ChatbotApi.sendMessage({
        userMessage: messageToSend,
        threadID: state.threadID,
      })

      // Process streaming response
      const fullResponse = await ChatbotApi.processStreamingResponse(
        response,
        updateCurrentResponse
      )

      // Add AI response
      addAiMessage(fullResponse)
    } catch (error) {
      console.error('Error sending message:', error)
      
      // Add error message
      addAiMessage('Sorry, there was an error processing your message. Please try again.')
    }
  }, [
    state.currentMessage,
    state.threadID,
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
    })
  }, [])

  return {
    // State
    messages: state.messages,
    currentMessage: state.currentMessage,
    currentResponse: state.currentResponse,
    isProcessing: state.isProcessing,
    isStarting: state.isStarting,
    
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
  }
}