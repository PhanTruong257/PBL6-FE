import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/auth-store'
import { USER_ROLE } from '@/types/auth'
import { Link } from '@tanstack/react-router'
import { 
  PlusCircle, 
  Search, 
  Filter, 
  MoreVertical,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

// Types for the exam
interface Exam {
  id: string
  title: string
  subject: string
  dateCreated: Date
  dateScheduled: Date | null
  duration: number // in minutes
  status: 'draft' | 'scheduled' | 'in-progress' | 'completed'
  createdBy: string
}

// Mock data
const mockExams: Exam[] = [
  {
    id: '1',
    title: 'Midterm Mathematics Exam',
    subject: 'Mathematics',
    dateCreated: new Date(2023, 8, 15),
    dateScheduled: new Date(2023, 9, 10, 10, 0),
    duration: 90,
    status: 'scheduled',
    createdBy: 'Prof. Johnson'
  },
  {
    id: '2',
    title: 'Physics Final Exam',
    subject: 'Physics',
    dateCreated: new Date(2023, 8, 20),
    dateScheduled: new Date(2023, 10, 5, 14, 0),
    duration: 120,
    status: 'draft',
    createdBy: 'Prof. Smith'
  },
  {
    id: '3',
    title: 'English Literature Quiz',
    subject: 'English',
    dateCreated: new Date(2023, 9, 1),
    dateScheduled: new Date(2023, 9, 5, 9, 0),
    duration: 60,
    status: 'completed',
    createdBy: 'Prof. Williams'
  },
  {
    id: '4',
    title: 'Computer Science Programming Test',
    subject: 'Computer Science',
    dateCreated: new Date(2023, 9, 5),
    dateScheduled: null,
    duration: 180,
    status: 'draft',
    createdBy: 'Prof. Davis'
  },
  {
    id: '5',
    title: 'Biology Lab Exam',
    subject: 'Biology',
    dateCreated: new Date(2023, 9, 8),
    dateScheduled: new Date(2023, 9, 12, 13, 0),
    duration: 120,
    status: 'in-progress',
    createdBy: 'Prof. Martinez'
  }
]

export function ExamList() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  
  // Check if user is admin or teacher to show create exam button
  const isTeacherOrAdmin = user?.role === USER_ROLE.TEACHER || user?.role === USER_ROLE.ADMIN
  
  // Filter exams based on search term and status
  const filteredExams = mockExams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.subject.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || exam.status === statusFilter
    
    return matchesSearch && matchesStatus
  })
  
  return (
    <div className="p-4 md:p-8 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('exams')}</h1>
        {isTeacherOrAdmin && (
          <Button asChild>
            <Link to="/">
              <PlusCircle className="h-4 w-4 mr-1" />
              {t('createExam')}
            </Link>
          </Button>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('searchExams')}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('filterByStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allStatuses')}</SelectItem>
              <SelectItem value="draft">{t('draft')}</SelectItem>
              <SelectItem value="scheduled">{t('scheduled')}</SelectItem>
              <SelectItem value="in-progress">{t('inProgress')}</SelectItem>
              <SelectItem value="completed">{t('completed')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableCaption>{t('listOfAllExams')}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>{t('title')}</TableHead>
              <TableHead>{t('subject')}</TableHead>
              <TableHead>{t('scheduledDate')}</TableHead>
              <TableHead>{t('duration')}</TableHead>
              <TableHead>{t('status')}</TableHead>
              <TableHead>{t('createdBy')}</TableHead>
              <TableHead className="text-right">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExams.length > 0 ? (
              filteredExams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium">{exam.title}</TableCell>
                  <TableCell>{exam.subject}</TableCell>
                  <TableCell>
                    {exam.dateScheduled
                      ? new Date(exam.dateScheduled).toLocaleDateString() + ', ' +
                        new Date(exam.dateScheduled).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : t('notScheduledYet')}
                  </TableCell>
                  <TableCell>{exam.duration} {t('minutes')}</TableCell>
                  <TableCell>
                    <Badge variant={
                      exam.status === 'completed' ? 'outline' :
                      exam.status === 'in-progress' ? 'secondary' :
                      exam.status === 'scheduled' ? 'default' : 'destructive'
                    }>
                      {t(exam.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{exam.createdBy}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">{t('openMenu')}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to="/" className="flex items-center">
                            <Eye className="h-4 w-4 mr-2" />
                            {t('viewExam')}
                          </Link>
                        </DropdownMenuItem>
                        {isTeacherOrAdmin && (
                          <>
                            <DropdownMenuItem asChild>
                              <Link to="/" className="flex items-center">
                                <Edit className="h-4 w-4 mr-2" />
                                {t('editExam')}
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive flex items-center">
                              <Trash2 className="h-4 w-4 mr-2" />
                              {t('deleteExam')}
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  {searchTerm || statusFilter !== 'all' ? t('noExamsMatchingFilters') : t('noExamsYet')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}