import { useState, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuthStore } from '@/store/auth-store'
import { USER_ROLE } from '@/types/auth'

// Types for events
interface Event {
  id: string
  title: string
  start: Date | string
  end: Date | string
  allDay: boolean
  classId?: string
  description?: string
  type: 'class' | 'exam' | 'meeting' | 'assignment'
  location?: string
  color?: string
}

// Mock data for calendar events
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Mathematics Class',
    start: new Date(new Date().setHours(10, 0, 0)),
    end: new Date(new Date().setHours(11, 30, 0)),
    allDay: false,
    classId: 'math101',
    type: 'class',
    location: 'Room 101',
    color: '#2563eb', // blue
  },
  {
    id: '2',
    title: 'Physics Exam',
    start: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 2);
      date.setHours(13, 0, 0);
      return date;
    })(),
    end: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 2);
      date.setHours(15, 0, 0);
      return date;
    })(),
    allDay: false,
    classId: 'phys101',
    type: 'exam',
    location: 'Exam Hall',
    color: '#dc2626', // red
  },
  {
    id: '3',
    title: 'Team Meeting',
    start: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      date.setHours(14, 0, 0);
      return date;
    })(),
    end: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      date.setHours(15, 0, 0);
      return date;
    })(),
    allDay: false,
    type: 'meeting',
    location: 'Meeting Room A',
    color: '#ca8a04', // yellow
  },
  {
    id: '4',
    title: 'Programming Assignment Due',
    start: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 4);
      date.setHours(23, 59, 0);
      return date;
    })(),
    end: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 4);
      date.setHours(23, 59, 0);
      return date;
    })(),
    allDay: true,
    classId: 'cs101',
    type: 'assignment',
    color: '#16a34a', // green
  },
]

export function Calendar() {
  const { t } = useTranslation()
  const calendarRef = useRef<FullCalendar | null>(null)
  const [events, setEvents] = useState<Event[]>(mockEvents)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isViewEventDialogOpen, setIsViewEventDialogOpen] = useState(false)
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: '',
    start: '',
    end: '',
    allDay: false,
    type: 'class',
    location: '',
  })
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const { user } = useAuthStore()
  const isTeacherOrAdmin = user?.role === USER_ROLE.TEACHER || user?.role === USER_ROLE.ADMIN
  
  // Event color mapping
  const eventColors = {
    class: '#2563eb', // blue
    exam: '#dc2626', // red
    meeting: '#ca8a04', // yellow
    assignment: '#16a34a', // green
  }
  
  // Handle date click to create new event
  const handleDateClick = (arg: { date: Date, allDay: boolean }) => {
    if (!isTeacherOrAdmin) return
    
    const start = new Date(arg.date)
    const end = new Date(new Date(start).setHours(start.getHours() + 1))
    
    setNewEvent({
      title: '',
      start: start.toISOString(),
      end: end.toISOString(),
      allDay: arg.allDay,
      type: 'class',
      location: '',
    })
    
    setIsDialogOpen(true)
  }
  
  // Handle event click to view/edit event
  const handleEventClick = (arg: { event: { id: string } }) => {
    const event = events.find(e => e.id === arg.event.id)
    if (event) {
      setSelectedEvent(event)
      setIsViewEventDialogOpen(true)
    }
  }
  
  // Handle adding new event
  const handleAddEvent = () => {
    if (!newEvent.title) return
    
    const event: Event = {
      id: Math.random().toString(36).substring(2),
      title: newEvent.title || '',
      start: newEvent.start || new Date(),
      end: newEvent.end || new Date(),
      allDay: newEvent.allDay || false,
      type: newEvent.type as 'class' | 'exam' | 'meeting' | 'assignment',
      location: newEvent.location,
      color: eventColors[newEvent.type as keyof typeof eventColors],
    }
    
    setEvents([...events, event])
    setIsDialogOpen(false)
    setNewEvent({
      title: '',
      start: '',
      end: '',
      allDay: false,
      type: 'class',
      location: '',
    })
  }
  
  // Handle deleting event
  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setEvents(events.filter(e => e.id !== selectedEvent.id))
      setIsViewEventDialogOpen(false)
      setSelectedEvent(null)
    }
  }
  
  return (
    <div className="p-4 md:p-8 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('calendar')}</h1>
        {isTeacherOrAdmin && (
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            {t('addEvent')}
          </Button>
        )}
      </div>
      
      <Card className="p-4">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
          }}
          events={events.map(event => ({
            ...event,
            backgroundColor: event.color,
            borderColor: event.color,
          }))}
          editable={isTeacherOrAdmin}
          selectable={isTeacherOrAdmin}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          height="auto"
        />
      </Card>
      
      {/* Add Event Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('addEvent')}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">{t('title')}</Label>
              <Input
                id="title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder={t('eventTitle')}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start">{t('startTime')}</Label>
                <Input
                  id="start"
                  type="datetime-local"
                  value={newEvent.start ? new Date(newEvent.start).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value).toISOString() })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end">{t('endTime')}</Label>
                <Input
                  id="end"
                  type="datetime-local"
                  value={newEvent.end ? new Date(newEvent.end).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value).toISOString() })}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="type">{t('eventType')}</Label>
              <Select
                value={newEvent.type}
                onValueChange={(value) => setNewEvent({ ...newEvent, type: value as 'class' | 'exam' | 'meeting' | 'assignment' })}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder={t('selectEventType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="class">{t('class')}</SelectItem>
                  <SelectItem value="exam">{t('exam')}</SelectItem>
                  <SelectItem value="meeting">{t('meeting')}</SelectItem>
                  <SelectItem value="assignment">{t('assignment')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="location">{t('location')}</Label>
              <Input
                id="location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                placeholder={t('eventLocation')}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleAddEvent}>{t('add')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View/Edit Event Dialog */}
      <Dialog open={isViewEventDialogOpen} onOpenChange={setIsViewEventDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4">
              <div className="grid grid-cols-[100px_1fr] gap-1">
                <div className="font-medium">{t('type')}</div>
                <div className={cn("capitalize", {
                  "text-blue-600": selectedEvent.type === 'class',
                  "text-red-600": selectedEvent.type === 'exam',
                  "text-yellow-600": selectedEvent.type === 'meeting',
                  "text-green-600": selectedEvent.type === 'assignment',
                })}>
                  {t(selectedEvent.type)}
                </div>
                
                <div className="font-medium">{t('when')}</div>
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>
                    {new Date(selectedEvent.start).toLocaleString()} - {new Date(selectedEvent.end).toLocaleString()}
                  </span>
                </div>
                
                {selectedEvent.location && (
                  <>
                    <div className="font-medium">{t('location')}</div>
                    <div>{selectedEvent.location}</div>
                  </>
                )}
              </div>
              
              {isTeacherOrAdmin && (
                <DialogFooter>
                  <Button variant="destructive" onClick={handleDeleteEvent}>
                    {t('delete')}
                  </Button>
                </DialogFooter>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}