import { ContentSection } from '../components/content-section'

interface NotificationsFormProps {
  role?: 'admin' | 'teacher' | 'student'
}

export function NotificationsForm({ role }: NotificationsFormProps) {
  const getNotificationsByRole = () => {
    const common = [
      { id: 'email-notifications', label: 'Email notifications', description: 'Receive notifications via email' },
      { id: 'push-notifications', label: 'Push notifications', description: 'Receive push notifications in browser' },
      { id: 'security-alerts', label: 'Security alerts', description: 'Get notified about security-related activities' }
    ]

    const roleSpecific = {
      admin: [
        { id: 'system-alerts', label: 'System alerts', description: 'Notifications about system issues and maintenance' },
        { id: 'user-activity', label: 'User activity', description: 'Get notified about user registrations and activities' },
        { id: 'backup-reports', label: 'Backup reports', description: 'Daily backup status notifications' }
      ],
      teacher: [
        { id: 'assignment-submissions', label: 'Assignment submissions', description: 'Get notified when students submit assignments' },
        { id: 'class-updates', label: 'Class updates', description: 'Notifications about class schedules and updates' },
        { id: 'student-messages', label: 'Student messages', description: 'Notifications for student messages and questions' }
      ],
      student: [
        { id: 'assignment-due', label: 'Assignment due dates', description: 'Reminders about upcoming assignment deadlines' },
        { id: 'grade-updates', label: 'Grade updates', description: 'Get notified when grades are posted' },
        { id: 'course-announcements', label: 'Course announcements', description: 'Notifications about course updates and announcements' }
      ]
    }

    return [...common, ...(role ? roleSpecific[role] : [])]
  }

  return (
    <ContentSection
      title="Notifications"
      desc="Configure how and when you want to receive notifications."
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">Notification Preferences</h3>
          {getNotificationsByRole().map((notification) => (
            <div key={notification.id} className="flex items-start space-x-3 p-3 border rounded-md">
              <input 
                type="checkbox" 
                className="mt-1 rounded" 
                defaultChecked
              />
              <div className="flex-1">
                <label className="text-sm font-medium block">
                  {notification.label}
                </label>
                <p className="text-xs text-muted-foreground">
                  {notification.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Delivery Settings</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Email frequency</label>
            <select className="w-full p-3 border rounded-md">
              <option>Immediately</option>
              <option>Daily digest</option>
              <option>Weekly digest</option>
              <option>Never</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Quiet hours</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground">From</label>
                <input type="time" className="w-full p-2 border rounded-md" defaultValue="22:00" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">To</label>
                <input type="time" className="w-full p-2 border rounded-md" defaultValue="08:00" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              No notifications will be sent during these hours.
            </p>
          </div>
        </div>

        {role === 'admin' && (
          <div className="p-4 border rounded-md bg-muted/50">
            <h3 className="font-medium text-sm mb-2">Admin Notifications</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="text-sm">Critical system alerts</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Weekly usage reports</span>
              </label>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
            Save Preferences
          </button>
          <button className="px-4 py-2 border rounded-md hover:bg-muted">
            Test Notifications
          </button>
        </div>
      </div>
    </ContentSection>
  )
}