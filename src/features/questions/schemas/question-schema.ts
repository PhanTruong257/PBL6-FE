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
  id: z.number(),
  text: z.string()
    .min(2, 'Option text is required')
    .refine(
      (val) => val.startsWith('=') || val.startsWith('~'),
      { message: 'Option must start with = (correct) or ~ (incorrect)' }
    ),
})

export const questionSchema = z
  .object({
    content: z
      .string()
      .min(10, 'Question content must be at least 10 characters')
      .max(2000, 'Question content must not exceed 2000 characters')
      .refine((val) => val.trim().length >= 10, {
        message: 'Question content cannot be only whitespace',
      }),
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
      // Validate ALL options must have text with valid prefix (no empty options allowed)
      const hasEmptyOption = data.options.some((opt) => opt.text.trim().length <= 1)
      
      if (hasEmptyOption) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'All options must have text. Please fill in or remove empty options.',
          path: ['options'],
        })
        return // Stop validation early
      }
      
      // Check minimum options (at least 2)
      if (data.options.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Multiple choice questions must have at least 2 options',
          path: ['options'],
        })
        return
      }

      // Check for correct answers (prefix with =)
      const correctAnswers = data.options.filter((opt) => opt.text.startsWith('='))
      
      if (correctAnswers.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Must have at least 1 correct answer (prefix with =)',
          path: ['options'],
        })
      }

      // Check single choice can only have 1 correct answer
      if (!data.is_multiple_answer && correctAnswers.length > 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Single choice questions can only have 1 correct answer',
          path: ['options'],
        })
      }

      // Validate all options have valid prefix (already validated in schema, but double-check)
      const hasInvalidPrefix = data.options.some(
        (opt) => !opt.text.startsWith('=') && !opt.text.startsWith('~')
      )
      if (hasInvalidPrefix) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'All options must start with = (correct) or ~ (incorrect)',
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
