import { ContentSection } from '../components/content-section'

interface ProfileFormProps {
  role: 'admin' | 'teacher' | 'student'
}

export function ProfileForm({ role }: ProfileFormProps) {
  const getRoleSpecificFields = () => {
    switch (role) {
      case 'admin':
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Admin Level</label>
              <select className="w-full p-2 border rounded-md bg-background">
                <option>Super Admin</option>
                <option>Admin</option>
                <option>Moderator</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md bg-background" 
                placeholder="IT Department"
              />
            </div>
          </>
        )
      
      case 'teacher':
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject Specialization</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md bg-background" 
                placeholder="Mathematics, Physics"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Experience (Years)</label>
              <input 
                type="number" 
                className="w-full p-2 border rounded-md bg-background" 
                placeholder="5"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Office Hours</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md bg-background" 
                placeholder="Mon-Fri 2:00-4:00 PM"
              />
            </div>
          </>
        )
      
      case 'student':
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Student ID</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md bg-muted" 
                value="STU-2023-001"
                disabled
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Major</label>
              <select className="w-full p-2 border rounded-md bg-background">
                <option>Computer Science</option>
                <option>Mathematics</option>
                <option>Physics</option>
                <option>Chemistry</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Year</label>
              <select className="w-full p-2 border rounded-md bg-background">
                <option>Freshman</option>
                <option>Sophomore</option>
                <option>Junior</option>
                <option>Senior</option>
              </select>
            </div>
          </>
        )
      
      default:
        return null
    }
  }

  return (
    <ContentSection
      title="Profile Information"
      desc={`Update your ${role} profile information and personal details.`}
    >
      <div className="space-y-6">
        {/* Common Fields */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">First Name</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded-md bg-background" 
              placeholder="John"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Last Name</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded-md bg-background" 
              placeholder="Doe"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <input 
            type="email" 
            className="w-full p-2 border rounded-md bg-background" 
            placeholder="john.doe@example.com"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Phone</label>
          <input 
            type="tel" 
            className="w-full p-2 border rounded-md bg-background" 
            placeholder="+1 (555) 123-4567"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Bio</label>
          <textarea 
            className="w-full p-2 border rounded-md bg-background h-20 resize-none" 
            placeholder="Tell us about yourself..."
          />
        </div>
        
        {/* Role-specific Fields */}
        {getRoleSpecificFields()}
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Role</label>
          <input 
            type="text" 
            className="w-full p-2 border rounded-md bg-muted" 
            value={role.charAt(0).toUpperCase() + role.slice(1)} 
            disabled
          />
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