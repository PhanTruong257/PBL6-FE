import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import { 
  Search, 
  Clock, 
  Calendar, 
  FileText,
  Book,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

// Types for student exams
interface StudentExam {
  id: string
  title: string
  subject: string
  dateScheduled: Date
  duration: number // in minutes
  status: 'upcoming' | 'missed' | 'completed'
  score?: number // only for completed exams
  totalQuestions: number
  answeredQuestions?: number
}

// Mock data
const mockUpcomingExams: StudentExam[] = [
  {
    id: '1',
    title: 'Midterm Mathematics Exam',
    subject: 'Mathematics',
    dateScheduled: new Date(new Date().setDate(new Date().getDate() + 2)),
    duration: 90,
    status: 'upcoming',
    totalQuestions: 30
  },
  {
    id: '2',
    title: 'Physics Quiz',
    subject: 'Physics',
    dateScheduled: new Date(new Date().setDate(new Date().getDate() + 5)),
    duration: 60,
    status: 'upcoming',
    totalQuestions: 20
  }
]

const mockCompletedExams: StudentExam[] = [
  {
    id: '3',
    title: 'English Literature Analysis',
    subject: 'English',
    dateScheduled: new Date(new Date().setDate(new Date().getDate() - 10)),
    duration: 60,
    status: 'completed',
    score: 85,
    totalQuestions: 20,
    answeredQuestions: 18
  },
  {
    id: '4',
    title: 'Computer Science Programming Test',
    subject: 'Computer Science',
    dateScheduled: new Date(new Date().setDate(new Date().getDate() - 15)),
    duration: 180,
    status: 'completed',
    score: 92,
    totalQuestions: 40,
    answeredQuestions: 40
  },
  {
    id: '5',
    title: 'Biology Quiz',
    subject: 'Biology',
    dateScheduled: new Date(new Date().setDate(new Date().getDate() - 5)),
    duration: 30,
    status: 'completed',
    score: 75,
    totalQuestions: 15,
    answeredQuestions: 15
  }
]

const mockMissedExams: StudentExam[] = [
  {
    id: '6',
    title: 'Chemistry Pop Quiz',
    subject: 'Chemistry',
    dateScheduled: new Date(new Date().setDate(new Date().getDate() - 7)),
    duration: 45,
    status: 'missed',
    totalQuestions: 15
  }
]

export function MyExamList() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  
  // Filter exams based on search term
  const filterExams = (exams: StudentExam[]) => {
    return exams.filter(exam => {
      return exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.subject.toLowerCase().includes(searchTerm.toLowerCase())
    })
  }
  
  const filteredUpcomingExams = filterExams(mockUpcomingExams)
  const filteredCompletedExams = filterExams(mockCompletedExams)
  const filteredMissedExams = filterExams(mockMissedExams)
  
  return (
    <div className="p-4 md:p-8 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('myExams')}</h1>
      </div>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('searchExams')}
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">
            {t('upcoming')} ({filteredUpcomingExams.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            {t('completed')} ({filteredCompletedExams.length})
          </TabsTrigger>
          <TabsTrigger value="missed">
            {t('missed')} ({filteredMissedExams.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          {filteredUpcomingExams.length > 0 ? (
            filteredUpcomingExams.map((exam) => (
              <Card key={exam.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{exam.title}</CardTitle>
                    <Badge>{t('upcoming')}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Book className="h-4 w-4 mr-2" />
                      <span>{exam.subject}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {exam.dateScheduled.toLocaleDateString()} at {' '}
                        {exam.dateScheduled.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{exam.duration} {t('minutes')}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <FileText className="h-4 w-4 mr-2" />
                      <span>{exam.totalQuestions} {t('questions')}</span>
                    </div>
                    
                    <Button className="w-full mt-4" asChild>
                      <Link to="/">
                        {t('takeExam')}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? t('noUpcomingExamsMatchingSearch') : t('noUpcomingExams')}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          {filteredCompletedExams.length > 0 ? (
            filteredCompletedExams.map((exam) => (
              <Card key={exam.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{exam.title}</CardTitle>
                    <div className="text-right">
                      <Badge variant="outline">{t('completed')}</Badge>
                      <div className="mt-2 text-lg font-bold">
                        {t('score')}: {exam.score}%
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Book className="h-4 w-4 mr-2" />
                      <span>{exam.subject}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {exam.dateScheduled.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{exam.duration} {t('minutes')}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{t('questionsAnswered')}: {exam.answeredQuestions}/{exam.totalQuestions}</span>
                        <span>{Math.round((exam.answeredQuestions! / exam.totalQuestions) * 100)}%</span>
                      </div>
                      <Progress value={(exam.answeredQuestions! / exam.totalQuestions) * 100} className="h-2" />
                    </div>
                    
                    <Button variant="outline" className="w-full mt-4" asChild>
                      <Link to="/">
                        {t('viewResults')}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? t('noCompletedExamsMatchingSearch') : t('noCompletedExams')}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="missed" className="space-y-4">
          {filteredMissedExams.length > 0 ? (
            filteredMissedExams.map((exam) => (
              <Card key={exam.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{exam.title}</CardTitle>
                    <Badge variant="destructive">{t('missed')}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Book className="h-4 w-4 mr-2" />
                      <span>{exam.subject}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {exam.dateScheduled.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{exam.duration} {t('minutes')}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <FileText className="h-4 w-4 mr-2" />
                      <span>{exam.totalQuestions} {t('questions')}</span>
                    </div>
                    
                    {/* Contact teacher button */}
                    <Button variant="outline" className="w-full mt-4">
                      {t('contactTeacher')}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? t('noMissedExamsMatchingSearch') : t('noMissedExams')}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}