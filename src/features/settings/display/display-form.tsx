import { ContentSection } from '../components/content-section'

interface DisplayFormProps {
  role?: 'admin' | 'teacher' | 'student'
}

export function DisplayForm({ role }: DisplayFormProps) {
  const themes = [
    { id: 'light', name: 'Light', description: 'Clean and bright interface' },
    { id: 'dark', name: 'Dark', description: 'Easy on the eyes in low light' },
    { id: 'system', name: 'System', description: 'Use system preference' }
  ]

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' }
  ]

  return (
    <ContentSection
      title="Display Settings" 
      desc="Customize how the interface looks and behaves for your preference."
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">Appearance</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Theme</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {themes.map((theme) => (
                <label key={theme.id} className="flex items-center space-x-3 p-3 border rounded-md cursor-pointer hover:bg-muted/50">
                  <input type="radio" name="theme" value={theme.id} defaultChecked={theme.id === 'system'} />
                  <div>
                    <div className="font-medium text-sm">{theme.name}</div>
                    <div className="text-xs text-muted-foreground">{theme.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Font size</label>
            <select className="w-full md:w-48 p-3 border rounded-md">
              <option>Small</option>
              <option selected>Medium</option>
              <option>Large</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Localization</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Language</label>
            <select className="w-full md:w-48 p-3 border rounded-md">
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date format</label>
            <select className="w-full md:w-48 p-3 border rounded-md">
              <option>MM/DD/YYYY</option>
              <option>DD/MM/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Time format</label>
            <select className="w-full md:w-48 p-3 border rounded-md">
              <option>12 hour (AM/PM)</option>
              <option>24 hour</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Layout</h3>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="rounded" defaultChecked />
              <span className="text-sm">Compact layout</span>
              <span className="text-xs text-muted-foreground">Use smaller spacing and components</span>
            </label>

            <label className="flex items-center space-x-3">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Show sidebar by default</span>
              <span className="text-xs text-muted-foreground">Keep navigation sidebar open</span>
            </label>

            {(role === 'admin' || role === 'teacher') && (
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="text-sm">Advanced controls</span>
                <span className="text-xs text-muted-foreground">Show additional management options</span>
              </label>
            )}

            {role === 'student' && (
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Simplified interface</span>
                <span className="text-xs text-muted-foreground">Hide advanced features</span>
              </label>
            )}
          </div>
        </div>

        {role === 'admin' && (
          <div className="p-4 border rounded-md bg-muted/50">
            <h3 className="font-medium text-sm mb-2">Admin Display Options</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Show debug information</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="text-sm">Display system metrics</span>
              </label>
            </div>
          </div>
        )}

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