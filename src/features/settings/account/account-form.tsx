import { ContentSection } from '../components/content-section'

interface AccountFormProps {
  role?: 'admin' | 'teacher' | 'student'
}

export function AccountForm({ role }: AccountFormProps) {
  return (
    <ContentSection
      title="Account Settings"
      desc="Update your account settings and security preferences."
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Display Name</label>
          <input 
            type="text" 
            className="w-full p-3 border rounded-md"
            placeholder="Enter your display name"
          />
          <p className="text-xs text-muted-foreground">
            This is the name that will be displayed on your profile.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <input 
            type="email" 
            className="w-full p-3 border rounded-md"
            placeholder="your.email@example.com"
          />
          <p className="text-xs text-muted-foreground">
            We'll use this email for account notifications.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Phone Number</label>
          <input 
            type="tel" 
            className="w-full p-3 border rounded-md"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Language</label>
          <select className="w-full p-3 border rounded-md">
            <option>English</option>
            <option>Vietnamese</option>
            <option>French</option>
            <option>Spanish</option>
          </select>
          <p className="text-xs text-muted-foreground">
            This is the language that will be used in the interface.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Timezone</label>
          <select className="w-full p-3 border rounded-md">
            <option>UTC+7 (Asia/Ho_Chi_Minh)</option>
            <option>UTC+0 (UTC)</option>
            <option>UTC-5 (America/New_York)</option>
            <option>UTC-8 (America/Los_Angeles)</option>
          </select>
        </div>

        {role === 'admin' && (
          <div className="p-4 border rounded-md bg-muted/50">
            <h3 className="font-medium text-sm mb-2">Admin Settings</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Receive system alerts</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Allow remote access</span>
              </label>
            </div>
          </div>
        )}

        <hr />

        <div className="space-y-4">
          <h3 className="font-medium">Security</h3>
          
          <button className="w-full p-3 border rounded-md text-left hover:bg-muted/50">
            <div className="flex justify-between items-center">
              <span>Change Password</span>
              <span className="text-xs text-muted-foreground">Last updated 30 days ago</span>
            </div>
          </button>
          
          <button className="w-full p-3 border rounded-md text-left hover:bg-muted/50">
            <div className="flex justify-between items-center">
              <span>Two-Factor Authentication</span>
              <span className="text-xs text-green-600">Enabled</span>
            </div>
          </button>
        </div>

        <div className="flex gap-4">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
            Save Changes
          </button>
          <button className="px-4 py-2 border rounded-md hover:bg-muted">
            Cancel
          </button>
        </div>
      </div>
    </ContentSection>
  )
}