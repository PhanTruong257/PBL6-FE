import { Search, Filter, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { searchSchema, type SearchFormValues } from '../schemas/question-schema'
import type { QuestionCategory } from '@/types/question'

interface SearchBarProps {
  categories: QuestionCategory[]
  onSearch: (values: SearchFormValues) => void
  defaultValues?: SearchFormValues
}

export function SearchBar({ categories, onSearch, defaultValues }: SearchBarProps) {
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: defaultValues || {
      search: '',
      type: undefined,
      difficulty: undefined,
      category_id: undefined,
      is_public: undefined,
    },
  })

  const hasActiveFilters = () => {
    const values = form.getValues()
    return !!(values.type || values.difficulty || values.category_id || values.is_public !== undefined)
  }

  const handleClearFilters = () => {
    form.reset({
      search: form.getValues('search'),
      type: undefined,
      difficulty: undefined,
      category_id: undefined,
      is_public: undefined,
    })
    onSearch(form.getValues())
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSearch)} className="space-y-4">
        <div className="flex gap-2">
          {/* Search Input */}
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search questions..."
                      className="pl-10"
                      {...field}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          {/* Filter Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
                {hasActiveFilters() && (
                  <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                    •
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Filters</h4>
                  {hasActiveFilters() && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFilters}
                      className="h-8 gap-1"
                    >
                      <X className="h-3 w-3" />
                      Clear
                    </Button>
                  )}
                </div>

                {/* Type Filter */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question Type</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value === 'all' ? undefined : value)}
                        value={field.value || 'all'}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="All types" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">All types</SelectItem>
                          <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                          <SelectItem value="essay">Essay</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* Difficulty Filter */}
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value === 'all' ? undefined : value)}
                        value={field.value || 'all'}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="All levels" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">All levels</SelectItem>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* Visibility Filter */}
                <FormField
                  control={form.control}
                  name="is_public"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visibility</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value === 'all' ? undefined : value === 'true')
                        }
                        value={
                          field.value === undefined ? 'all' : field.value.toString()
                        }
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="All questions" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">All questions</SelectItem>
                          <SelectItem value="true">Public only</SelectItem>
                          <SelectItem value="false">Private only</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            </PopoverContent>
          </Popover>

          {/* Search Button */}
          <Button type="submit">Search</Button>
        </div>
      </form>
    </Form>
  )
}
