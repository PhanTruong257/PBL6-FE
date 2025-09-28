import { ContentSection } from '../components/content-section'

interface AppearanceFormProps {
  role?: 'admin' | 'teacher' | 'student'
}

export function AppearanceForm({ role }: AppearanceFormProps) {
  return (
    <ContentSection
      title="Appearance"
      desc="Customize the appearance and theme of your interface."
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium">Theme</label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="radio" name="theme" className="rounded" defaultChecked />
              <span className="text-sm">Light</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="theme" className="rounded" />
              <span className="text-sm">Dark</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="theme" className="rounded" />
              <span className="text-sm">System</span>
            </label>
          </div>
          <p className="text-xs text-muted-foreground">
            Choose your preferred theme or let it follow your system settings.
          </p>
        </div>
        
        {role === 'admin' && (
          <div className="p-3 border rounded-md bg-muted/50">
            <span className="text-sm font-medium">Admin Theme Options</span>
            <div className="mt-2 space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Custom branding</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">High contrast mode</span>
              </label>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <label className="text-sm font-medium">Color Scheme</label>
          <div className="grid grid-cols-4 gap-2">
            <div className="p-3 border rounded-md bg-blue-500 cursor-pointer" title="Blue"></div>
            <div className="p-3 border rounded-md bg-green-500 cursor-pointer" title="Green"></div>
            <div className="p-3 border rounded-md bg-purple-500 cursor-pointer" title="Purple"></div>
            <div className="p-3 border rounded-md bg-red-500 cursor-pointer" title="Red"></div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Font Size</label>
          <select className="w-full p-3 border rounded-md">
            <option>Small</option>
            <option>Medium</option>
            <option>Large</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Sidebar Position</label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="radio" name="sidebar" className="rounded" defaultChecked />
              <span className="text-sm">Left</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="sidebar" className="rounded" />
              <span className="text-sm">Right</span>
            </label>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">Advanced Options</label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Enable animations</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Reduce motion</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">High contrast mode</span>
            </label>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
            Save Changes
          </button>
          <button className="px-4 py-2 border rounded-md hover:bg-muted">
            Reset to Default
          </button>
        </div>
      </div>
    </ContentSection>
  )
}