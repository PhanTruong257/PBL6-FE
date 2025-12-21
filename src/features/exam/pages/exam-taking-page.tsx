  import { useParams, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { useExamTaking } from '../hooks'
import { ExamPasswordDialog } from '../components/exam-password-dialog'
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
  const navigate = useNavigate()
  const examId = Number(params.examId)
  const [examPassword, setExamPassword] = useState<string | undefined>(undefined)
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)

  const {
    submission,
    currentQuestion,
    currentAnswer,
    isLoading,
    isSavingAnswer,
    isSubmittingExam,
    remainingTime,
    passwordRequired,
    passwordError,
    isVerifyingPassword,
    setCurrentAnswer,
    goToQuestion,
    goToNextQuestion,
    goToPrevQuestion,
    saveAnswer,
    submitExam,
    verifyPassword,
    canGoNext,
    canGoPrev,
  } = useExamTaking({ examId, password: examPassword })
  
  // Handle password verification
  const handlePasswordSubmit = async (password: string) => {
    const success = await verifyPassword(password)
    if (success) {
      setExamPassword(password)
    }
  }
  
  // Handle password dialog cancel
  const handlePasswordCancel = () => {
    navigate({ to: '/exam/student' })
  }

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


    // Set new timer for 0.5 seconds
    autoSaveTimerRef.current = setTimeout(() => {
      console.log('Auto-saving answer...')
      saveAnswer(true) // silent save (no toast)
    }, 500)

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
    
    // Parse current answer based on question type
    // Format from backend:
    // - Single answer: "a" (plain string, no quotes)
    // - Multiple answer: "[a,b,c]" (array format without quotes inside, NOT JSON)
    // - Essay: "text content" (plain string)
    let currentAnswerArray: string[] = []
    if (currentAnswer) {
      if (isMultipleAnswer) {
        // Multiple answer - parse array format [a,b,c]
        try {
          // Remove brackets and split by comma
          const stripped = currentAnswer.replace(/^\[|\]$/g, '').trim()
          if (stripped) {
            currentAnswerArray = stripped.split(',').map(item => item.trim())
          }
        } catch {
          // If parse fails, treat as empty
          currentAnswerArray = []
        }
      } else {
        // Single answer - treat as plain string
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
          text: ans.text.substring(1) || '' // Remove leading letter (e.g., "A. ")
        }))
      } else {
        // Try to convert object to array
        optionsArray = Object.entries(opts).map(([key, value]: [string, any]) => ({
          id: key,
          text: value.text.substring(1) || '',
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
            const optionIdString = String(option.id)
            const isChecked = currentAnswerArray.includes(optionIdString)
            const optionLabel = String.fromCharCode(65 + index) // A, B, C, D...
            
            const handleToggle = () => {
              const newAnswerArray = isChecked
                ? currentAnswerArray.filter((id: string) => id !== optionIdString)
                : [...currentAnswerArray, optionIdString]
              
              // Format: "[a,b,c]" - Array format without quotes inside
              const newAnswer = `[${newAnswerArray.join(',')}]`
              setCurrentAnswer(newAnswer)
              
              // Auto-save immediately for multiple choice
              setTimeout(() => {
                saveAnswer(true) // silent save
              }, 100)
            }
            
            return (
              <div
                key={option.id}
                className={cn(
                  'group relative flex items-start gap-4 p-4 border-2 rounded-xl transition-all duration-200 cursor-pointer',
                  isChecked
                    ? 'bg-primary/10 border-primary shadow-md'
                    : 'bg-card border-border hover:border-primary/50 hover:shadow-sm'
                )}
                onClick={handleToggle}
              >
                {/* Option Label */}
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm shrink-0 transition-colors",
                  isChecked 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                )}>
                  {optionLabel}
                </div>
                
                {/* Checkbox */}
                <div className="pt-0.5">
                  <Checkbox
                    id={option.id}
                    checked={isChecked}
                    onCheckedChange={handleToggle}
                    className="w-5 h-5 border-2"
                    onClick={(e) => e.stopPropagation()} // Prevent double trigger
                  />
                </div>
                
                {/* Option Text */}
                <Label
                  htmlFor={option.id}
                  className="flex-1 text-base leading-relaxed pt-0.5"
                  onClick={(e) => e.preventDefault()}
                >
                  {option.text.substring(1)}
                </Label>
                
                {/* Checkmark indicator */}
                {isChecked && (
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
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
          onValueChange={(value) => {
            // Format: "a" - plain string (no JSON)
            setCurrentAnswer(value)
            
            // Auto-save in background (silent)
            setTimeout(() => {
              saveAnswer(true)
            }, 100)
          }}
          className="space-y-3"
        >
          {optionsArray.map((option, index) => {
            const optionIdString = String(option.id)
            const isSelected = currentAnswer === optionIdString
            const optionLabel = String.fromCharCode(65 + index) // A, B, C, D...
            
            return (
              <div
                key={option.id}
                className={cn(
                  'group relative flex items-start gap-4 p-4 border-2 rounded-xl transition-all duration-200 cursor-pointer',
                  isSelected
                    ? 'bg-primary/10 border-primary shadow-md'
                    : 'bg-card border-border hover:border-primary/50 hover:shadow-sm'
                )}
                onClick={() => {
                  // Format: "a" - plain string (no JSON)
                  setCurrentAnswer(optionIdString)
                  
                  // Auto-save in background
                  setTimeout(() => {
                    saveAnswer(true)
                  }, 100)
                }}
              >
                {/* Option Label */}
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm shrink-0 transition-colors",
                  isSelected 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                )}>
                  {optionLabel}
                </div>
                
                {/* Radio Button */}
                <div className="pt-0.5">
                  <RadioGroupItem 
                    value={optionIdString} 
                    id={option.id}
                    className="w-5 h-5 border-2"
                  />
                </div>
                
                {/* Option Text */}
                <Label
                  htmlFor={option.id}
                  className="flex-1 cursor-pointer text-base leading-relaxed pt-0.5"
                >
                  {option.text.substring(1)}
                </Label>
                
                {/* Checkmark indicator */}
                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
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
    const wordCount = currentAnswer ? currentAnswer.toString().trim().split(/\s+/).filter(Boolean).length : 0

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <Label className="text-base font-medium text-foreground">
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
          className="min-h-[320px] resize-y text-base leading-relaxed border-2 focus:border-primary focus:ring-2 focus:ring-primary/20"
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

  // Show password dialog if required
  if (passwordRequired) {
    return (
      <>
        <ExamPasswordDialog
          open={passwordRequired}
          examTitle={submission?.exam_title || 'Bài thi'}
          error={passwordError || undefined}
          isVerifying={isVerifyingPassword}
          onSubmit={handlePasswordSubmit}
          onCancel={handlePasswordCancel}
        />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground">Đang xác thực...</p>
          </div>
        </div>
      </>
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
    // Current question is considered answered if curre ntAnswer is not empty
    if (questionNum === currentQuestion.order) {
      return currentAnswer && currentAnswer.toString().trim() !== ''
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
        <Card className="mb-6 bg-primary/5 border-primary/20">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="text-2xl text-foreground">
                  {submission.exam_title}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
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
                      : 'bg-card border-primary/30 text-primary'
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
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b-2">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {/* Question Number Badge */}
                  <div className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg font-semibold shadow-sm">
                    <ListOrdered className="w-4 h-4" />
                    <span>Câu {currentQuestion.order}</span>
                  </div>
                  
                  {/* Question Type Badge */}
                  <Badge 
                    variant="secondary"
                    className="px-3 py-1.5 bg-card border-2 border-primary/20 text-foreground font-medium"
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
                      currentQuestion.difficulty === 'easy' && "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400",
                      currentQuestion.difficulty === 'medium' && "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400",
                      currentQuestion.difficulty === 'hard' && "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
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
                      className="px-3 py-1.5 bg-secondary border-secondary text-secondary-foreground font-medium"
                    >
                      {currentQuestion.category.name}
                    </Badge>
                  )}
                  
                  {/* Points Badge */}
                  <div className="ml-auto flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg font-bold shadow-sm">
                    <Award className="w-4 h-4" />
                    <span>{currentQuestion.points} điểm</span>
                  </div>
                </div>
                
                {/* Question Content */}
                <div className="bg-card p-4 rounded-lg border-2 border-border">
                  <CardTitle className="text-xl font-semibold leading-relaxed text-foreground">
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
              <div className="flex items-start gap-3 p-4 bg-destructive/10 border-2 border-destructive/30 rounded-xl text-destructive shadow-sm animate-pulse">
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
                : "hover:bg-primary/10 hover:border-primary hover:scale-105"
            )}
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Câu trước
          </Button>

          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border-2 border-primary/20">
            <span className="text-sm font-medium text-foreground">
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
                : "hover:bg-primary/10 hover:border-primary hover:scale-105"
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
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20 shadow-md">
            <CardContent className="pt-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className={cn(
                  "w-5 h-5",
                  isTimeRunningOut ? "text-destructive animate-pulse" : "text-primary"
                )} />
                <p className="text-sm font-semibold text-foreground">
                  Thời gian còn lại
                </p>
              </div>
              <div
                className={cn(
                  'text-4xl font-mono font-bold py-2',
                  isTimeRunningOut ? 'text-destructive animate-pulse' : 'text-primary'
                )}
              >
                {formatTime(remainingTime)}
              </div>
              {isTimeRunningOut && (
                <p className="text-xs text-destructive font-medium mt-2">
                  ⚠️ Sắp hết giờ!
                </p>
              )}
            </CardContent>
          </Card>

          {/* Question Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-sm text-foreground">
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
                        isCurrent && 'bg-primary hover:bg-primary/90 text-primary-foreground border-primary shadow-lg scale-110',
                        !isCurrent && isAnswered && 'bg-green-500/20 hover:bg-green-500/30 text-green-600 dark:text-green-400 border-green-500/50',
                        !isCurrent && !isAnswered && 'bg-card hover:bg-muted border-border hover:border-primary/50'
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
