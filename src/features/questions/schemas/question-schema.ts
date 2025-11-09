import { z } from 'zod'

// ============================================================
// QUESTION CATEGORY SCHEMAS
// ============================================================
export const categorySchema = z.object({
  name: z
    .string()
    .min(3, 'Category name must be at least 3 characters')
    .max(100, 'Category name must not exceed 100 characters'),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
})

export type CategoryFormValues = z.infer<typeof categorySchema>

// ============================================================
// QUESTION SCHEMAS
// ============================================================
const questionOptionSchema = z.object({
  id: z.string(),
  content: z.string().min(1, 'Option content is required'),
  is_correct: z.boolean(),
})

export const questionSchema = z
  .object({
    content: z
      .string()
      .min(10, 'Question content must be at least 10 characters')
      .max(2000, 'Question content must not exceed 2000 characters'),
    type: z.enum(['multiple_choice', 'essay'], {
      required_error: 'Question type is required',
    }),
    difficulty: z.enum(['easy', 'medium', 'hard'], {
      required_error: 'Difficulty level is required',
    }),
    category_id: z.number().optional().nullable(),
    is_multiple_answer: z.boolean().default(false),
    options: z.array(questionOptionSchema).default([]),
    is_public: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'multiple_choice') {
      if (data.options.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Multiple choice questions must have at least 2 options',
          path: ['options'],
        })
      }

      const correctAnswers = data.options.filter((opt) => opt.is_correct).length || 0
      if (correctAnswers === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Must have at least 1 correct answer',
          path: ['options'],
        })
      }

      if (!data.is_multiple_answer && correctAnswers > 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Single choice questions can only have 1 correct answer',
          path: ['options'],
        })
      }

      const emptyOptions = data.options.filter((opt) => !opt.content.trim()).length || 0
      if (emptyOptions > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'All options must have content',
          path: ['options'],
        })
      }
    }
  })

export type QuestionFormValues = z.infer<typeof questionSchema>

// ============================================================
// SEARCH SCHEMAS
// ============================================================
export const searchSchema = z.object({
  search: z.string().optional(),
  type: z.enum(['multiple_choice', 'essay']).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  category_id: z.number().optional().nullable(),
  is_public: z.boolean().optional(),
})

export type SearchFormValues = z.infer<typeof searchSchema>
