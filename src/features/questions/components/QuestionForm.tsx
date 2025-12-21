import { useEffect, useRef } from 'react'
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
import {
  questionSchema,
  type QuestionFormValues,
} from '../schemas/question-schema'
import type { Question, QuestionCategory } from '@/types/question'
import { toast } from '@/libs/toast'
import { useQuestionsTranslation } from '@/features/questions/hooks'

// Sortable Option Component
export interface SortableOptionProps {
  id: number
  index: number
  isMultipleAnswer: boolean
  text: string
  fieldsLength: number
  onTextChange: (value: string) => void
  onRemove: () => void
  t: (key: string, options?: any) => string
}

export function SortableOption({
  id,
  index,
  isMultipleAnswer,
  text,
  fieldsLength,
  onTextChange,
  onRemove,
  t,
}: SortableOptionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id.toString() })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  // Extract actual text without prefix
  const isCorrect = text.startsWith('=')
  const displayText = text.length > 0 ? text.substring(1) : ''

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-3 p-3 border rounded-lg bg-background"
    >
      <div
        {...attributes}
        {...listeners}
        className="mt-2 cursor-move touch-none"
      >
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
            onCheckedChange={(checked) => {
              const prefix = checked === true ? '=' : '~'
              onTextChange(`${prefix}${displayText}`)
            }}
            id={'option-' + index}
          />
        </div>
      )}

      <div className="flex-1">
        <Input
          placeholder={t('form.optionPlaceholder', { number: index + 1 })}
          value={displayText}
          onChange={(e) => {
            const prefix = text.startsWith('=') ? '=' : '~'
            onTextChange(`${prefix}${e.target.value}`)
          }}
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
  const { t } = useQuestionsTranslation()

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
            { id: 1, text: '~' }, // Default to incorrect with empty text
            { id: 2, text: '~' },
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
    }),
  )

  // Handle options based on question type
  useEffect(() => {
    if (questionType === 'multiple_choice' && fields.length === 0) {
      // Add default options for multiple choice
      append([
        { id: 1, text: '~' },
        { id: 2, text: '~' },
      ])
    } else if (questionType === 'essay' && fields.length > 0) {
      // Clear options for essay type
      form.setValue('options', [])
    }
  }, [questionType, fields.length, append, form])

  // Ref for validation timeout cleanup
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current)
      }
    }
  }, [])

  const handleAddOption = () => {
    const currentOptionsCount = fields.length
    const newId = currentOptionsCount + 1
    append({ id: newId, text: '~' })
    toast.success(
      t('messages.optionAdded'),
      t('messages.optionAddedDesc', { number: newId }),
    )
  }

  const handleRemoveOption = (index: number) => {
    if (fields.length > 2) {
      remove(index)
      toast.info(
        t('messages.optionRemoved'),
        t('messages.optionRemovedDesc', { number: index + 1 }),
      )
    } else {
      toast.warning(
        t('messages.cannotRemove'),
        t('messages.minOptionsRequired'),
      )
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id == active.id)
      const newIndex = fields.findIndex((field) => field.id == over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        move(oldIndex, newIndex)
      }
    }
  }

  const handleSubmit = async (values: QuestionFormValues) => {
    // Re-assign IDs to ensure they're sequential
    const processedValues = {
      ...values,
      options: values.options.map((opt, idx) => ({
        id: idx + 1,
        text: opt.text,
      })),
    }
    await onSubmit(processedValues)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.content')} *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('form.contentPlaceholder')}
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t('validation.contentMin', { count: 10 })} -{' '}
                {t('validation.contentMax', { count: 2000 })}
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
                <FormLabel>{t('form.type')} *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('form.type')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="multiple_choice">
                      {t('types.multipleChoice')}
                    </SelectItem>
                    <SelectItem value="essay">{t('types.essay')}</SelectItem>
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
                <FormLabel>{t('form.difficulty')} *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('form.difficulty')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="easy">{t('difficulty.easy')}</SelectItem>
                    <SelectItem value="medium">
                      {t('difficulty.medium')}
                    </SelectItem>
                    <SelectItem value="hard">{t('difficulty.hard')}</SelectItem>
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
                <FormLabel>{t('form.category')}</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(
                      value && value !== 'none' ? parseInt(value) : undefined,
                    )
                  }}
                  value={field.value?.toString() || 'none'}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('form.selectCategory')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">{t('form.noCategory')}</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem
                        key={cat.category_id}
                        value={cat.category_id.toString()}
                      >
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
              <FormLabel>{t('form.options')} *</FormLabel>
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
                            // When switching to single answer, keep only first correct answer
                            const options = form.getValues('options') || []
                            const firstCorrectIndex = options.findIndex((opt) =>
                              opt.text.startsWith('='),
                            )
                            if (firstCorrectIndex !== -1) {
                              options.forEach((_opt, idx) => {
                                const currentText = form.getValues(
                                  `options.${idx}.text` as any,
                                ) as string
                                const displayText =
                                  currentText.length > 0
                                    ? currentText.substring(1)
                                    : ''
                                const prefix =
                                  idx === firstCorrectIndex ? '=' : '~'
                                form.setValue(
                                  `options.${idx}.text` as any,
                                  `${prefix}${displayText}`,
                                )
                              })
                            }
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">
                      {t('form.isMultipleAnswer')}
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-3">
              {!isMultipleAnswer ? (
                <RadioGroup
                  value={(() => {
                    const correctIndex = fields.findIndex((_f, idx) => {
                      const text = form.getValues(
                        `options.${idx}.text` as any,
                      ) as string
                      return text.startsWith('=')
                    })
                    return correctIndex >= 0
                      ? correctIndex.toString()
                      : undefined
                  })()}
                  onValueChange={(value) => {
                    const selectedIndex = parseInt(value)
                    fields.forEach((_field, index) => {
                      const currentText = form.getValues(
                        `options.${index}.text` as any,
                      ) as string
                      const displayText =
                        currentText.length > 0 ? currentText.substring(1) : ''
                      const prefix = index === selectedIndex ? '=' : '~'
                      form.setValue(
                        `options.${index}.text` as any,
                        `${prefix}${displayText}`,
                        {
                          shouldValidate: true,
                          shouldDirty: true,
                          shouldTouch: true,
                        },
                      )
                    })
                    // Force re-validation after state update
                    if (validationTimeoutRef.current) {
                      clearTimeout(validationTimeoutRef.current)
                    }
                    validationTimeoutRef.current = setTimeout(
                      () => form.trigger('options'),
                      100,
                    )
                  }}
                >
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={fields.map((f) => f.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {fields.map((field, index) => (
                        <SortableOption
                          key={field.id}
                          id={field.id}
                          index={index}
                          isMultipleAnswer={false}
                          text={
                            form.watch(`options.${index}.text` as any) as string
                          }
                          fieldsLength={fields.length}
                          onTextChange={(value: string) => {
                            form.setValue(
                              `options.${index}.text` as any,
                              value,
                              {
                                shouldValidate: true,
                              },
                            )
                            // Trigger validation after text change
                            if (validationTimeoutRef.current) {
                              clearTimeout(validationTimeoutRef.current)
                            }
                            validationTimeoutRef.current = setTimeout(
                              () => form.trigger('options'),
                              50,
                            )
                          }}
                          onRemove={() => handleRemoveOption(index)}
                          t={t}
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
                  <SortableContext
                    items={fields.map((f) => f.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {fields.map((field, index) => (
                      <SortableOption
                        key={field.id}
                        id={field.id}
                        index={index}
                        isMultipleAnswer={true}
                        text={
                          form.watch(`options.${index}.text` as any) as string
                        }
                        fieldsLength={fields.length}
                        onTextChange={(value: string) => {
                          form.setValue(`options.${index}.text` as any, value, {
                            shouldValidate: true,
                          })
                          // Trigger validation after text change
                          if (validationTimeoutRef.current) {
                            clearTimeout(validationTimeoutRef.current)
                          }
                          validationTimeoutRef.current = setTimeout(
                            () => form.trigger('options'),
                            50,
                          )
                        }}
                        onRemove={() => handleRemoveOption(index)}
                        t={t}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </div>

            {form.formState.errors.options &&
              typeof form.formState.errors.options.message === 'string' && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.options.message}
                </p>
              )}

            <Button
              type="button"
              variant="outline"
              onClick={handleAddOption}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('form.addOption')}
            </Button>
          </div>
        )}

        <FormField
          control={form.control}
          name="is_public"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div>
                <FormLabel className="!mt-0">{t('form.isPublic')}</FormLabel>
                <FormDescription>
                  {t('form.isPublicDescription')}
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t('actions.cancel')}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? t('actions.saving')
              : question
                ? t('actions.update')
                : t('actions.create')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
