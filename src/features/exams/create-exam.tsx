import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
// Import dialog instead of alert dialog to avoid module resolution issues
import {
  Dialog as AlertDialog,
  DialogContent as AlertDialogContent,
  DialogDescription as AlertDialogDescription,
  DialogFooter as AlertDialogFooter,
  DialogHeader as AlertDialogHeader,
  DialogTitle as AlertDialogTitle,
} from '@/components/ui/dialog'
import { Button as AlertDialogAction } from '@/components/ui/button'
import { Button as AlertDialogCancel } from '@/components/ui/button'
import {
  ArrowLeft,
  Trash2,
  Plus,
  Save,
  CalendarIcon,
  ClockIcon,
  FileText
} from 'lucide-react'

// Question types
type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'multiple_select'

// Define the schema for form validation
const examFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  passingScore: z.number().min(0, 'Passing score cannot be negative').max(100, 'Passing score cannot exceed 100'),
  scheduledDate: z.date().optional(),
  showResults: z.boolean(),
  showCorrectAnswers: z.boolean(),
  randomizeQuestions: z.boolean(),
  timeLimit: z.number().min(0, 'Time limit cannot be negative'),
  questions: z.array(
    z.object({
      id: z.string(),
      type: z.enum(['multiple_choice', 'true_false', 'short_answer', 'essay', 'multiple_select']),
      text: z.string().min(1, 'Question text is required'),
      points: z.number().min(1, 'Points must be at least 1'),
      options: z.array(z.object({
        id: z.string(),
        text: z.string(),
        isCorrect: z.boolean(),
      })).optional(),
      correctAnswer: z.string().optional(),
    })
  ).min(1, 'At least one question is required'),
})

type ExamFormValues = z.infer<typeof examFormSchema>

export function CreateExam() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('general')
  const [confirmDiscard, setConfirmDiscard] = useState(false)
  
  // Generate a unique ID
  const generateId = () => Math.random().toString(36).substring(2, 9)
  
  // Default values for the form
  const defaultValues: ExamFormValues = {
    title: '',
    description: '',
    subject: '',
    duration: 60,
    passingScore: 60,
    showResults: true,
    showCorrectAnswers: true,
    randomizeQuestions: false,
    timeLimit: 0, // 0 means no time limit
    questions: [
      {
        id: generateId(),
        type: 'multiple_choice',
        text: '',
        points: 1,
        options: [
          { id: generateId(), text: '', isCorrect: false },
          { id: generateId(), text: '', isCorrect: false },
          { id: generateId(), text: '', isCorrect: false },
          { id: generateId(), text: '', isCorrect: false },
        ],
      },
    ],
  }
  
  // Initialize the form with react-hook-form
  const form = useForm<ExamFormValues>({
    resolver: zodResolver(examFormSchema),
    defaultValues,
    mode: 'onChange',
  })
  
  // Setup field arrays for questions
  const { fields: questions, append: appendQuestion, remove: removeQuestion } = useFieldArray({
    control: form.control,
    name: 'questions',
  })
  
  // Handle form submission
  const onSubmit = (data: ExamFormValues) => {
    console.log('Form submitted:', data)
    // Here you would typically send the data to your API
    navigate({ to: "/" })
  }
  
  // Add a new question
  const addQuestion = (type: QuestionType) => {
    const newQuestion: {
      id: string;
      type: QuestionType;
      text: string;
      points: number;
      options?: { id: string; text: string; isCorrect: boolean }[];
    } = {
      id: generateId(),
      type,
      text: '',
      points: 1,
    }
    
    // Add options for multiple choice and multiple select questions
    if (type === 'multiple_choice' || type === 'multiple_select') {
      newQuestion.options = [
        { id: generateId(), text: '', isCorrect: false },
        { id: generateId(), text: '', isCorrect: false },
        { id: generateId(), text: '', isCorrect: false },
        { id: generateId(), text: '', isCorrect: false },
      ]
    }
    
    // Add options for true/false questions
    if (type === 'true_false') {
      newQuestion.options = [
        { id: generateId(), text: 'True', isCorrect: false },
        { id: generateId(), text: 'False', isCorrect: false },
      ]
    }
    
    appendQuestion(newQuestion)
  }
  
  // This function is removed as it's causing React Hook issues
  
  // Add a new option to a multiple choice question
  const addOption = (questionIndex: number) => {
    // Get the current options array
    const currentOptions = form.getValues(`questions.${questionIndex}.options`) || [];
    
    // Add the new option
    const newOptions = [
      ...currentOptions,
      { id: generateId(), text: '', isCorrect: false }
    ];
    
    // Update the form
    form.setValue(`questions.${questionIndex}.options`, newOptions);
  }
  
  // Remove an option from a multiple choice question
  const removeOption = (questionIndex: number, optionIndex: number) => {
    // Get the current options array
    const currentOptions = form.getValues(`questions.${questionIndex}.options`) || [];
    
    // Remove the option at the specified index
    const newOptions = currentOptions.filter((_, idx) => idx !== optionIndex);
    
    // Update the form
    form.setValue(`questions.${questionIndex}.options`, newOptions);
  }
  
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={() => setConfirmDiscard(true)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="ml-2 text-3xl font-bold">{t('createExam')}</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">{t('generalInfo')}</TabsTrigger>
          <TabsTrigger value="questions">{t('questions')}</TabsTrigger>
          <TabsTrigger value="settings">{t('settings')}</TabsTrigger>
          <TabsTrigger value="preview">{t('preview')}</TabsTrigger>
        </TabsList>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('examDetails')}</CardTitle>
                  <CardDescription>{t('provideBasicExamInformation')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('examTitle')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('enterExamTitle')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('examDescription')}</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder={t('enterExamDescription')}
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('subject')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('enterSubject')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('duration')}</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <Input
                                type="number"
                                min={1}
                                placeholder="60"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                              <span className="ml-2">{t('minutes')}</span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="passingScore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('passingScore')}</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <Input
                                type="number"
                                min={0}
                                max={100}
                                placeholder="60"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                              <span className="ml-2">%</span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Scheduling information - would be connected to a date picker in production */}
                  <FormField
                    control={form.control}
                    name="scheduledDate"
                    render={({ field: { value, onChange, ...restField } }) => (
                      <FormItem>
                        <FormLabel>{t('scheduledDate')}</FormLabel>
                        <FormDescription>{t('leaveEmptyForDraft')}</FormDescription>
                        <FormControl>
                          <div className="flex items-center">
                            <Input 
                              type="datetime-local" 
                              {...restField}
                              value={value instanceof Date ? value.toISOString().slice(0, 16) : ''}
                              onChange={(e) => {
                                const date = e.target.value ? new Date(e.target.value) : undefined;
                                onChange(date);
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button type="button" onClick={() => setActiveTab('questions')}>
                  {t('next')}: {t('questions')}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="questions" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{t('examQuestions')}</h2>
                <div className="flex gap-2">
                  <Select onValueChange={(value) => addQuestion(value as QuestionType)}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder={t('addQuestionType')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple_choice">{t('multipleChoice')}</SelectItem>
                      <SelectItem value="true_false">{t('trueFalse')}</SelectItem>
                      <SelectItem value="short_answer">{t('shortAnswer')}</SelectItem>
                      <SelectItem value="essay">{t('essay')}</SelectItem>
                      <SelectItem value="multiple_select">{t('multipleSelect')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {questions.map((question, questionIndex) => {
                // Get options for this question if they exist
                const questionOptions = form.watch(`questions.${questionIndex}.options`) || []
                const questionType = form.watch(`questions.${questionIndex}.type`)
                
                return (
                  <Card key={question.id} className="relative">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2"
                      onClick={() => removeQuestion(questionIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span>{t('question')} {questionIndex + 1}</span>
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-3">
                          <FormField
                            control={form.control}
                            name={`questions.${questionIndex}.text`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('questionText')}</FormLabel>
                                <FormControl>
                                  <Textarea {...field} placeholder={t('enterQuestionText')} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div>
                          <FormField
                            control={form.control}
                            name={`questions.${questionIndex}.points`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('points')}</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min={1}
                                    placeholder="1"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      {/* Question type specific fields */}
                      {(questionType === 'multiple_choice' || questionType === 'multiple_select') && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{t('options')}</h3>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addOption(questionIndex)}
                            >
                              <Plus className="h-4 w-4 mr-1" /> {t('addOption')}
                            </Button>
                          </div>
                          
                          {questionOptions.map((option, optionIndex) => (
                            <div key={option.id} className="flex items-center gap-2">
                              {questionType === 'multiple_choice' ? (
                                <Controller
                                  control={form.control}
                                  name={`questions.${questionIndex}.options`}
                                  render={({ field }) => (
                                    <RadioGroup
                                      value={questionOptions.findIndex(opt => opt.isCorrect).toString()}
                                      onValueChange={(value: string) => {
                                        const newOptions = [...questionOptions].map((opt, idx) => ({
                                          ...opt,
                                          isCorrect: idx.toString() === value
                                        }))
                                        field.onChange(newOptions)
                                      }}
                                    >
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value={optionIndex.toString()} id={`q${questionIndex}-opt${optionIndex}`} />
                                      </div>
                                    </RadioGroup>
                                  )}
                                />
                              ) : (
                                <FormField
                                  control={form.control}
                                  name={`questions.${questionIndex}.options.${optionIndex}.isCorrect`}
                                  render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              )}
                              
                              <FormField
                                control={form.control}
                                name={`questions.${questionIndex}.options.${optionIndex}.text`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Input {...field} placeholder={t('enterOptionText')} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              {questionOptions.length > 2 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeOption(questionIndex, optionIndex)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {questionType === 'true_false' && (
                        <div className="space-y-4">
                          <h3 className="font-medium">{t('selectCorrectAnswer')}</h3>
                          
                          <Controller
                            control={form.control}
                            name={`questions.${questionIndex}.options`}
                            render={({ field }) => (
                              <RadioGroup
                                value={questionOptions.findIndex(opt => opt.isCorrect).toString()}
                                onValueChange={(value: string) => {
                                  const newOptions = [...questionOptions].map((opt, idx) => ({
                                    ...opt,
                                    isCorrect: idx.toString() === value
                                  }))
                                  field.onChange(newOptions)
                                }}
                              >
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="0" id={`q${questionIndex}-true`} />
                                    <label htmlFor={`q${questionIndex}-true`}>{t('true')}</label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="1" id={`q${questionIndex}-false`} />
                                    <label htmlFor={`q${questionIndex}-false`}>{t('false')}</label>
                                  </div>
                                </div>
                              </RadioGroup>
                            )}
                          />
                        </div>
                      )}
                      
                      {questionType === 'short_answer' && (
                        <FormField
                          control={form.control}
                          name={`questions.${questionIndex}.correctAnswer`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('correctAnswer')}</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder={t('enterCorrectAnswer')} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      
                      {questionType === 'essay' && (
                        <FormItem>
                          <FormLabel>{t('gradingNotes')}</FormLabel>
                          <FormDescription>{t('essayGradingDescription')}</FormDescription>
                          <FormControl>
                            <Textarea placeholder={t('enterGradingNotes')} />
                          </FormControl>
                        </FormItem>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
              
              {questions.length === 0 && (
                <Card className="p-6 text-center">
                  <p className="text-muted-foreground">{t('noQuestionsYet')}</p>
                  <Button variant="outline" className="mt-4" onClick={() => addQuestion('multiple_choice')}>
                    <Plus className="h-4 w-4 mr-1" /> {t('addFirstQuestion')}
                  </Button>
                </Card>
              )}
              
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setActiveTab('general')}>
                  {t('back')}: {t('generalInfo')}
                </Button>
                <Button type="button" onClick={() => setActiveTab('settings')}>
                  {t('next')}: {t('settings')}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('examSettings')}</CardTitle>
                  <CardDescription>{t('configureExamBehavior')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="showResults"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            {t('showResultsImmediately')}
                          </FormLabel>
                          <FormDescription>
                            {t('showResultsImmediatelyDescription')}
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="showCorrectAnswers"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            {t('showCorrectAnswers')}
                          </FormLabel>
                          <FormDescription>
                            {t('showCorrectAnswersDescription')}
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="randomizeQuestions"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            {t('randomizeQuestions')}
                          </FormLabel>
                          <FormDescription>
                            {t('randomizeQuestionsDescription')}
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="timeLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('timeLimit')}</FormLabel>
                        <FormDescription>{t('timeLimitDescription')}</FormDescription>
                        <FormControl>
                          <div className="flex items-center">
                            <Input
                              type="number"
                              min={0}
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                            <span className="ml-2">{t('minutes')}</span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setActiveTab('questions')}>
                  {t('back')}: {t('questions')}
                </Button>
                <Button type="button" onClick={() => setActiveTab('preview')}>
                  {t('next')}: {t('preview')}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('examPreview')}</CardTitle>
                  <CardDescription>{t('reviewExamBeforePublishing')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{form.watch('title')}</h3>
                    <p className="text-muted-foreground">{form.watch('description')}</p>
                    
                    <div className="flex flex-wrap gap-4 mt-4">
                      <div className="flex items-center text-sm">
                        <FileText className="h-4 w-4 mr-1" />
                        <span>{t('subject')}: {form.watch('subject')}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        <span>{t('duration')}: {form.watch('duration')} {t('minutes')}</span>
                      </div>
                      {form.watch('scheduledDate') && (
                        <div className="flex items-center text-sm">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          <span>
                            {t('scheduledFor')}: {form.watch('scheduledDate')?.toLocaleString() || ''}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">{t('questions')}: {questions.length}</h3>
                    
                    {questions.map((question, index) => (
                      <div key={question.id} className="p-4 border rounded-md">
                        <div className="flex justify-between">
                          <span className="font-medium">{t('question')} {index + 1}</span>
                          <span>{form.watch(`questions.${index}.points`)} {t('points')}</span>
                        </div>
                        <p className="mt-2">{form.watch(`questions.${index}.text`)}</p>
                        
                        {/* Display options for multiple choice and true/false questions */}
                        {(form.watch(`questions.${index}.type`) === 'multiple_choice' ||
                          form.watch(`questions.${index}.type`) === 'true_false' ||
                          form.watch(`questions.${index}.type`) === 'multiple_select') && (
                          <div className="mt-2 space-y-1">
                            {form.watch(`questions.${index}.options`)?.map((option) => (
                              <div key={option.id} className="flex items-center gap-2">
                                {form.watch(`questions.${index}.type`) === 'multiple_choice' ? (
                                  <RadioGroupItem value={option.id} disabled />
                                ) : (
                                  <Checkbox disabled />
                                )}
                                <span>{option.text}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Display short answer question */}
                        {form.watch(`questions.${index}.type`) === 'short_answer' && (
                          <Input className="mt-2" placeholder={t('shortAnswerPlaceholder')} disabled />
                        )}
                        
                        {/* Display essay question */}
                        {form.watch(`questions.${index}.type`) === 'essay' && (
                          <Textarea className="mt-2" placeholder={t('essayAnswerPlaceholder')} disabled />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex w-full justify-between">
                    <Button type="button" variant="outline" onClick={() => setActiveTab('settings')}>
                      {t('back')}: {t('settings')}
                    </Button>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" onClick={() => form.reset(defaultValues)}>
                        {t('resetForm')}
                      </Button>
                      <Button type="submit">
                        <Save className="h-4 w-4 mr-1" />
                        {form.watch('scheduledDate') ? t('publishExam') : t('saveAsDraft')}
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </form>
        </Form>
      </Tabs>
      
      {/* Confirm discard changes dialog */}
      <AlertDialog open={confirmDiscard} onOpenChange={setConfirmDiscard}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('discardChanges')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('discardChangesDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline" onClick={() => setConfirmDiscard(false)}>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate({ to: "/" })}>
              {t('discardChanges')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}