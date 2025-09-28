import { Link, useLocation } from '@tanstack/react-router'

interface SettingsTabsProps {
  basePath: string
}

export function SettingsTabs({ basePath }: SettingsTabsProps) {
  const location = useLocation()
  
  const tabs = [
    { id: 'profile', label: 'Profile', path: `${basePath}` },
    { id: 'account', label: 'Account', path: `${basePath}/account` },
    { id: 'appearance', label: 'Appearance', path: `${basePath}/appearance` },
    { id: 'notifications', label: 'Notifications', path: `${basePath}/notifications` },
    { id: 'display', label: 'Display', path: `${basePath}/display` }
  ]

  return (
    <div className="border-b">
      <nav className="flex space-x-8">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path
          return (
            <Link
              key={tab.id}
              to={tab.path}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
              }`}
            >
              {tab.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}