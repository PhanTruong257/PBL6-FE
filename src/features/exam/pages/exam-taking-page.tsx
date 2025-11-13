import { useParams } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { useExamTaking } from '../hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Send,
  AlertCircle,
  ListOrdered,
  CheckCircle2,
  Circle,
  Award,
  FileText,
  CheckSquare
} from 'lucide-react'
import { cn } from '@/libs/utils/cn'

export function ExamTakingPage() {
  const params = useParams({ strict: false })
  const examId = Number(params.examId)
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)

  const {
    submission,
    currentQuestion,
    currentAnswer,
    isLoading,
    isSavingAnswer,
    isSubmittingExam,
    remainingTime,
    setCurrentAnswer,
    goToQuestion,
    goToNextQuestion,
    goToPrevQuestion,
    saveAnswer,
    submitExam,
    canGoNext,
    canGoPrev,
  } = useExamTaking({ examId })

  // Format remaining time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  // Auto-save for essay questions (debounced)
  useEffect(() => {
    // Only auto-save for essay questions
    if (!currentAnswer || !currentQuestion || currentQuestion.type !== 'essay') {
      return
    }

    // // Clear previous timer
    // if (autoSaveTimerRef.current) {
    //   clearTimeout(autoSaveTimerRef.current)
    // }

    // Set new timer for 2 seconds
    autoSaveTimerRef.current = setTimeout(() => {
      console.log('Auto-saving answer...')
      saveAnswer(true) // silent save (no toast)
    }, 2000)

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [currentAnswer, currentQuestion])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && canGoPrev) {
        goToPrevQuestion()
      } else if (e.key === 'ArrowRight' && canGoNext) {
        goToNextQuestion()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [canGoNext, canGoPrev, goToNextQuestion, goToPrevQuestion])

  // Render multiple choice options
  const renderMultipleChoice = () => {
    if (!currentQuestion) return null

    const isMultipleAnswer = currentQuestion.is_multiple_answer
    
    // Parse current answer safely - handle both string and JSON array formats
    let currentAnswerArray: string[] = []
    if (currentAnswer) {
      try {
        // Try to parse as JSON first (for multiple answers: ["a", "b"])
        const parsed = JSON.parse(currentAnswer)
        currentAnswerArray = Array.isArray(parsed) ? parsed : [parsed]
      } catch {
        // If not valid JSON, treat as a single string value (for single answer: "a")
        currentAnswerArray = [currentAnswer]
      }
    }

    // Handle different options formats from backend
    let optionsArray: Array<{ id: string; text: string }> = []
    
    if (Array.isArray(currentQuestion.options)) {
      // Options is already an array
      optionsArray = currentQuestion.options
    } else if (currentQuestion.options && typeof currentQuestion.options === 'object') {
      // Options might be an object like { answers: [...] }
      const opts = currentQuestion.options as any
      if (opts.answers && Array.isArray(opts.answers)) {
        optionsArray = opts.answers.map((ans: any) => ({
          id: ans.id || String(ans.text),
          text: ans.text || ans.content || String(ans),
        }))
      } else {
        // Try to convert object to array
        optionsArray = Object.entries(opts).map(([key, value]: [string, any]) => ({
          id: key,
          text: typeof value === 'string' ? value : value.text || value.content || String(value),
        }))
      }
    }

    if (optionsArray.length === 0) {
      return (
        <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg">
          <p className="text-amber-800">No options available for this question.</p>
        </div>
      )
    }

    if (isMultipleAnswer) {
      // Checkbox for multiple answers
      return (
        <div className="space-y-3">
          {optionsArray.map((option, index) => {
            const isChecked = currentAnswerArray.includes(option.id)
            const optionLabel = String.fromCharCode(65 + index) // A, B, C, D...
            
            return (
              <div
                key={option.id}
                className={cn(
                  'group relative flex items-start gap-4 p-4 border-2 rounded-xl transition-all duration-200 cursor-pointer',
                  isChecked
                    ? 'bg-indigo-50 border-indigo-500 shadow-md'
                    : 'bg-white border-gray-200 hover:border-indigo-300 hover:shadow-sm'
                )}
                onClick={() => {
                  const checked = !isChecked
                  const newAnswer = checked
                    ? JSON.stringify([...currentAnswerArray, option.id])
                    : JSON.stringify(currentAnswerArray.filter((id: string) => id !== option.id))
                  
                  setCurrentAnswer(newAnswer)
                  
                  // Auto-save immediately for multiple choice
                  setTimeout(() => {
                    saveAnswer(true) // silent save
                  }, 100)
                }}
              >
                {/* Option Label */}
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm shrink-0 transition-colors",
                  isChecked 
                    ? "bg-indigo-600 text-white" 
                    : "bg-gray-100 text-gray-600 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                )}>
                  {optionLabel}
                </div>
                
                {/* Checkbox */}
                <div className="pt-0.5">
                  <Checkbox
                    id={option.id}
                    checked={isChecked}
                    className="w-5 h-5 border-2"
                  />
                </div>
                
                {/* Option Text */}
                <Label
                  htmlFor={option.id}
                  className="flex-1 text-base leading-relaxed pt-0.5"
                  onClick={(e) => e.preventDefault()}
                >
                  {option.text}
                </Label>
                
                {/* Checkmark indicator */}
                {isChecked && (
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                )}
              </div>
            )
          })}
        </div>
      )
    } else {
      // Radio button for single answer
      return (
        <RadioGroup
          value={currentAnswer || ''}
          className="space-y-3"
        >
          {optionsArray.map((option, index) => {
            const isSelected = currentAnswer === option.id
            const optionLabel = String.fromCharCode(65 + index) // A, B, C, D...
            
            return (
              <div
                key={option.id}
                className={cn(
                  'group relative flex items-start gap-4 p-4 border-2 rounded-xl transition-all duration-200 cursor-pointer',
                  isSelected
                    ? 'bg-indigo-50 border-indigo-500 shadow-md'
                    : 'bg-white border-gray-200 hover:border-indigo-300 hover:shadow-sm'
                )}
                onClick={() => {
                  setCurrentAnswer(option.id)
                  
                  // Auto-save immediately for multiple choice
                  setTimeout(() => {
                    saveAnswer(true) // silent save
                  }, 100)
                }}
              >
                {/* Option Label */}
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm shrink-0 transition-colors",
                  isSelected 
                    ? "bg-indigo-600 text-white" 
                    : "bg-gray-100 text-gray-600 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                )}>
                  {optionLabel}
                </div>
                
                {/* Radio Button */}
                <div className="pt-0.5">
                  <RadioGroupItem 
                    value={option.id} 
                    id={option.id}
                    className="w-5 h-5 border-2"
                  />
                </div>
                
                {/* Option Text */}
                <Label
                  htmlFor={option.id}
                  className="flex-1 cursor-pointer text-base leading-relaxed pt-0.5"
                >
                  {option.text}
                </Label>
                
                {/* Checkmark indicator */}
                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                )}
              </div>
            )
          })}
        </RadioGroup>
      )
    }
  }

  // Render essay textarea
  const renderEssay = () => {
    const wordCount = currentAnswer ? currentAnswer.trim().split(/\s+/).filter(Boolean).length : 0
    
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <Label className="text-base font-medium text-gray-700">
            Câu trả lời của bạn:
          </Label>
          <span className="text-muted-foreground">
            {wordCount} từ
          </span>
        </div>
        <Textarea
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          placeholder="Nhập câu trả lời của bạn ở đây... Câu trả lời sẽ được tự động lưu."
          className="min-h-[320px] resize-y text-base leading-relaxed border-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
        {isSavingAnswer && (
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Save className="w-3.5 h-3.5 animate-pulse" />
            Đang lưu...
          </p>
        )}
      </div>
    )
  }

  if (isLoading || !submission || !currentQuestion) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Đang tải bài thi...</p>
        </div>
      </div>
    )
  }

  const isTimeRunningOut = remainingTime < 300 // Less than 5 minutes

  // Generate array of question numbers for navigation
  const questionNumbers = Array.from(
    { length: submission.total_questions },
    (_, i) => i + 1
  )
  
  // Helper to check if a question has been answered
  const isQuestionAnswered = (questionNum: number) => {
    // Current question is considered answered if currentAnswer is not empty
    if (questionNum === currentQuestion.order) {
      return currentAnswer && currentAnswer.trim() !== ''
    }
    // For other questions, we don't have the data in the current implementation
    // This would need to be fetched from the backend or cached
    return false
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-6 max-w-5xl">
        {/* Header with Timer and Info */}
        <Card className="mb-6 bg-indigo-50 border-indigo-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="text-2xl text-indigo-900">
                  {submission.exam_title}
                </CardTitle>
                <p className="text-sm text-indigo-600 mt-1">
                  Khoa Công nghệ Thông tin • Trường Đại học Bách khoa Đà Nẵng
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Timer */}
                <div
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg border font-mono text-lg font-semibold',
                    isTimeRunningOut
                      ? 'bg-destructive/10 border-destructive text-destructive'
                      : 'bg-white border-indigo-300 text-indigo-700'
                  )}
                >
                  <Clock className="w-5 h-5" />
                  <span>{formatTime(remainingTime)}</span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Question Card */}
        <Card className="mb-6 shadow-lg border-2">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b-2">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {/* Question Number Badge */}
                  <div className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-semibold shadow-sm">
                    <ListOrdered className="w-4 h-4" />
                    <span>Câu {currentQuestion.order}</span>
                  </div>
                  
                  {/* Question Type Badge */}
                  <Badge 
                    variant="secondary"
                    className="px-3 py-1.5 bg-white border-2 border-indigo-200 text-indigo-700 font-medium"
                  >
                    {currentQuestion.type === 'multiple_choice' ? (
                      <>
                        {currentQuestion.is_multiple_answer ? (
                          <>
                            <CheckSquare className="w-3.5 h-3.5 mr-1.5" />
                            Chọn nhiều đáp án
                          </>
                        ) : (
                          <>
                            <Circle className="w-3.5 h-3.5 mr-1.5" />
                            Chọn một đáp án
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <FileText className="w-3.5 h-3.5 mr-1.5" />
                        Tự luận
                      </>
                    )}
                  </Badge>
                  
                  {/* Difficulty Badge */}
                  <Badge 
                    variant="outline"
                    className={cn(
                      "px-3 py-1.5 font-medium border-2",
                      currentQuestion.difficulty === 'easy' && "bg-green-50 border-green-300 text-green-700",
                      currentQuestion.difficulty === 'medium' && "bg-amber-50 border-amber-300 text-amber-700",
                      currentQuestion.difficulty === 'hard' && "bg-red-50 border-red-300 text-red-700"
                    )}
                  >
                    {currentQuestion.difficulty === 'easy' && '⚡ Dễ'}
                    {currentQuestion.difficulty === 'medium' && '⚖️ Trung bình'}
                    {currentQuestion.difficulty === 'hard' && '🔥 Khó'}
                  </Badge>
                  
                  {/* Category Badge */}
                  {currentQuestion.category && (
                    <Badge 
                      variant="outline"
                      className="px-3 py-1.5 bg-purple-50 border-purple-300 text-purple-700 font-medium"
                    >
                      {currentQuestion.category.name}
                    </Badge>
                  )}
                  
                  {/* Points Badge */}
                  <div className="ml-auto flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-lg font-bold shadow-sm">
                    <Award className="w-4 h-4" />
                    <span>{currentQuestion.points} điểm</span>
                  </div>
                </div>
                
                {/* Question Content */}
                <div className="bg-white p-4 rounded-lg border-2 border-indigo-100">
                  <CardTitle className="text-xl font-semibold leading-relaxed text-gray-800">
                    {currentQuestion.content}
                  </CardTitle>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {/* Answer Input */}
            {currentQuestion.type === 'multiple_choice'
              ? renderMultipleChoice()
              : renderEssay()}

            {/* Time warning */}
            {isTimeRunningOut && (
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-xl text-red-700 shadow-sm animate-pulse">
                <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold mb-1">
                    ⏰ Cảnh báo: Thời gian sắp hết!
                  </p>
                  <p className="text-sm">
                    Thời gian còn lại ít hơn 5 phút. Hãy hoàn thành các câu hỏi còn lại và nộp bài sớm.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation and Actions */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Button
            variant="outline"
            size="lg"
            onClick={goToPrevQuestion}
            disabled={!canGoPrev}
            className={cn(
              "min-w-[160px] h-12 border-2 font-semibold transition-all",
              !canGoPrev 
                ? "opacity-50" 
                : "hover:bg-indigo-50 hover:border-indigo-500 hover:scale-105"
            )}
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Câu trước
          </Button>

          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-200">
            <span className="text-sm font-medium text-indigo-700">
              Câu {currentQuestion.order} / {submission.total_questions}
            </span>
          </div>

          <Button
            variant="outline"
            size="lg"
            onClick={goToNextQuestion}
            disabled={!canGoNext}
            className={cn(
              "min-w-[160px] h-12 border-2 font-semibold transition-all",
              !canGoNext 
                ? "opacity-50" 
                : "hover:bg-indigo-50 hover:border-indigo-500 hover:scale-105"
            )}
          >
            Câu tiếp theo
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

      </div>

      {/* Right Sidebar - Question Navigator */}
      <div className="w-80 border-l bg-card p-6 overflow-y-auto">
        <div className="sticky top-6 space-y-6">

          {/* Timer in sidebar */}
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 shadow-md">
            <CardContent className="pt-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className={cn(
                  "w-5 h-5",
                  isTimeRunningOut ? "text-red-600 animate-pulse" : "text-indigo-600"
                )} />
                <p className="text-sm font-semibold text-gray-700">
                  Thời gian còn lại
                </p>
              </div>
              <div
                className={cn(
                  'text-4xl font-mono font-bold py-2',
                  isTimeRunningOut ? 'text-red-600 animate-pulse' : 'text-indigo-700'
                )}
              >
                {formatTime(remainingTime)}
              </div>
              {isTimeRunningOut && (
                <p className="text-xs text-red-600 font-medium mt-2">
                  ⚠️ Sắp hết giờ!
                </p>
              )}
            </CardContent>
          </Card>

          {/* Question Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-sm text-gray-700">
                Danh sách câu hỏi
              </h4>
              <Badge variant="secondary" className="font-medium">
                {currentQuestion.order}/{submission.total_questions}
              </Badge>
            </div>
            
            <ScrollArea className="h-[400px]">
              <div className="grid grid-cols-5 gap-2 pr-4">
                {questionNumbers.map((num) => {
                  const isCurrent = num === currentQuestion.order
                  const isAnswered = isQuestionAnswered(num)
                  
                  return (
                    <Button
                      key={num}
                      variant="outline"
                      size="sm"
                      onClick={() => goToQuestion(num)}
                      className={cn(
                        'w-full aspect-square p-0 font-bold text-sm transition-all duration-200 border-2',
                        isCurrent && 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600 shadow-lg scale-110',
                        !isCurrent && isAnswered && 'bg-green-500 hover:bg-green-600 text-white border-green-500',
                        !isCurrent && !isAnswered && 'bg-white hover:bg-gray-50 border-gray-300 hover:border-indigo-400'
                      )}
                    >
                      {isCurrent ? (
                        num
                      ) : isAnswered ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        num
                      )}
                    </Button>
                  )
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Submit Button */}
          <div className="space-y-3">
            <Button
              variant="destructive"
              size="lg"
              onClick={submitExam}
              disabled={isSubmittingExam}
              className="w-full h-12 font-bold text-base shadow-lg hover:shadow-xl transition-all"
            >
              <Send className="w-5 h-5 mr-2" />
              {isSubmittingExam ? 'Đang nộp bài...' : 'Nộp bài thi'}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground px-2 leading-relaxed">
              Hãy kiểm tra kỹ câu trả lời trước khi nộp bài. Bạn không thể chỉnh sửa sau khi nộp.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
