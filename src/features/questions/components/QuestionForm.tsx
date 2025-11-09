import { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { questionSchema, type QuestionFormValues } from '../schemas/question-schema'
import type { Question, QuestionCategory } from '@/types/question'

// Sortable Option Component
interface SortableOptionProps {
  id: string
  index: number
  isMultipleAnswer: boolean
  content: string
  isCorrect: boolean
  fieldsLength: number
  onContentChange: (value: string) => void
  onCorrectChange: (value: boolean) => void
  onRemove: () => void
}

function SortableOption({
  id,
  index,
  isMultipleAnswer,
  content,
  isCorrect,
  fieldsLength,
  onContentChange,
  onCorrectChange,
  onRemove,
}: SortableOptionProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-3 p-3 border rounded-lg bg-background"
    >
      <div {...attributes} {...listeners} className="mt-2 cursor-move touch-none">
        <GripVertical className="h-5 w-5 text-muted-foreground hover:text-foreground" />
      </div>

      {!isMultipleAnswer ? (
        <div className="mt-2">
          <RadioGroupItem value={index.toString()} id={'option-' + index} />
        </div>
      ) : (
        <div className="mt-2">
          <Checkbox
            checked={isCorrect}
            onCheckedChange={(checked) => onCorrectChange(checked === true)}
            id={'option-' + index}
          />
        </div>
      )}

      <div className="flex-1">
        <Input
          placeholder={'Option ' + (index + 1)}
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
        />
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onRemove}
        disabled={fieldsLength <= 2}
        className="mt-1"
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  )
}

interface QuestionFormProps {
  question?: Question
  categories: QuestionCategory[]
  onSubmit: (values: QuestionFormValues) => void | Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export function QuestionForm({
  question,
  categories,
  onSubmit,
  onCancel,
  isSubmitting,
}: QuestionFormProps) {
  const form = useForm({
    resolver: zodResolver(questionSchema),
    mode: 'onChange' as const,
    defaultValues: question
      ? {
          content: question.content,
          type: question.type,
          difficulty: question.difficulty,
          category_id: question.category_id || undefined,
          is_multiple_answer: question.is_multiple_answer,
          options: question.options || [],
          is_public: question.is_public,
        }
      : {
          content: '',
          type: 'multiple_choice',
          difficulty: 'medium',
          category_id: undefined,
          is_multiple_answer: false,
          options: [
            { id: crypto.randomUUID(), content: '', is_correct: false },
            { id: crypto.randomUUID(), content: '', is_correct: false },
          ],
          is_public: false,
        },
  })

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'options',
  })

  const questionType = form.watch('type')
  const isMultipleAnswer = form.watch('is_multiple_answer')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    if (questionType === 'multiple_choice' && fields.length === 0) {
      append([
        { id: crypto.randomUUID(), content: '', is_correct: false },
        { id: crypto.randomUUID(), content: '', is_correct: false },
      ])
    }
  }, [questionType, fields.length, append])

  const handleAddOption = () => {
    append({ id: crypto.randomUUID(), content: '', is_correct: false })
  }

  const handleRemoveOption = (index: number) => {
    if (fields.length > 2) {
      remove(index)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id)
      const newIndex = fields.findIndex((field) => field.id === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        move(oldIndex, newIndex)
      }
    }
  }

  const handleSubmit = async (values: QuestionFormValues) => {
    await onSubmit(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question Content *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your question here..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Minimum 10 characters, maximum 2000 characters
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                    <SelectItem value="essay">Essay</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value && value !== 'none' ? parseInt(value) : undefined)
                  }}
                  value={field.value?.toString() || 'none'}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">No category</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.category_id} value={cat.category_id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {questionType === 'multiple_choice' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <FormLabel>Answer Options *</FormLabel>
              <FormField
                control={form.control}
                name="is_multiple_answer"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked)
                          if (!checked) {
                            const options = form.getValues('options') || []
                            const firstCorrectIndex = options.findIndex((opt) => opt.is_correct)
                            if (firstCorrectIndex !== -1) {
                              options.forEach((_opt, idx) => {
                                form.setValue(`options.${idx}.is_correct` as any, idx === firstCorrectIndex)
                              })
                            }
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Multiple correct answers</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-3">
              {!isMultipleAnswer ? (
                <RadioGroup
                  value={fields.findIndex((_f, idx) => form.getValues(`options.${idx}.is_correct` as any)).toString()}
                  onValueChange={(value) => {
                    const selectedIndex = parseInt(value)
                    fields.forEach((_field, index) => {
                      form.setValue(`options.${index}.is_correct` as any, index === selectedIndex)
                    })
                  }}
                >
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                      {fields.map((field, index) => (
                        <SortableOption
                          key={field.id}
                          id={field.id}
                          index={index}
                          isMultipleAnswer={false}
                          content={form.watch(`options.${index}.content` as any) as string}
                          isCorrect={form.watch(`options.${index}.is_correct` as any) as boolean}
                          fieldsLength={fields.length}
                          onContentChange={(value) => form.setValue(`options.${index}.content` as any, value)}
                          onCorrectChange={(value) => {
                            fields.forEach((_f, idx) => {
                              form.setValue(`options.${idx}.is_correct` as any, idx === index && value)
                            })
                          }}
                          onRemove={() => handleRemoveOption(index)}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                </RadioGroup>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                    {fields.map((field, index) => (
                      <SortableOption
                        key={field.id}
                        id={field.id}
                        index={index}
                        isMultipleAnswer={true}
                        content={form.watch(`options.${index}.content` as any) as string}
                        isCorrect={form.watch(`options.${index}.is_correct` as any) as boolean}
                        fieldsLength={fields.length}
                        onContentChange={(value) => form.setValue(`options.${index}.content` as any, value)}
                        onCorrectChange={(value) => form.setValue(`options.${index}.is_correct` as any, value)}
                        onRemove={() => handleRemoveOption(index)}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </div>

            {form.formState.errors.options && typeof form.formState.errors.options.message === 'string' && (
              <p className="text-sm font-medium text-destructive">{form.formState.errors.options.message}</p>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={handleAddOption}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          </div>
        )}

        <FormField
          control={form.control}
          name="is_public"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div>
                <FormLabel className="!mt-0">Make this question public</FormLabel>
                <FormDescription>
                  Public questions can be viewed and used by other teachers
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : question ? 'Update Question' : 'Create Question'}
          </Button>
        </div>
      </form>
    </Form>
  )
}