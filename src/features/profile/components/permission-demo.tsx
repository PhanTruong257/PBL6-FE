import { useRecoilValue } from 'recoil'
import {
  currentUserState,
  userPermissionsSelector,
} from '@/global/recoil/user'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, Lock, Unlock, Users, BookOpen, Settings } from 'lucide-react'

export function PermissionDemo() {
  const user = useRecoilValue(currentUserState)
  const permissions = useRecoilValue(userPermissionsSelector)
  
  // Helper functions for permission checks
  const hasPermission = (permissionKey: string) => {
    return permissions.some(p => p.key === permissionKey)
  }
  
  const hasAnyPermission = (permissionKeys: string[]) => {
    return permissionKeys.some(key => hasPermission(key))
  }
  
  // Permission checks
  const canViewUsers = hasPermission('GET.users.list')
  const canCreateUser = hasPermission('POST.users.create')
  const canDeleteUser = hasPermission('DELETE.users.:id')
  
  const canViewCourses = hasAnyPermission(['GET.classes', 'GET.classes.:class_id'])
  const canCreateCourse = hasPermission('POST.classes.create')
  
  const canManageSettings = hasPermission('PATCH.users.profile')
  
  const isAdmin = user?.role === 'admin'

  if (!user) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Not logged in. Please log in to see permission demo.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Permission-Based UI Demo
          </CardTitle>
          <CardDescription>
            This page demonstrates how UI elements can be shown/hidden based on user permissions from Recoil selectors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Your Roles:</h3>
            <div className="flex flex-wrap gap-2">
              {user.roles ? (
                user.roles.map((role) => (
                  <Badge key={role.role_id} variant="secondary">
                    {role.name}
                  </Badge>
                ))
              ) : (
                <Badge variant="outline">No roles assigned</Badge>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">
              Your Permissions ({permissions.length}):
            </h3>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {permissions.length > 0 ? (
                permissions.slice(0, 20).map((permission) => (
                  <Badge key={permission.permission_id} variant="outline" className="text-xs">
                    {permission.key}
                  </Badge>
                ))
              ) : (
                <Badge variant="outline">No permissions assigned</Badge>
              )}
              {permissions.length > 20 && (
                <Badge variant="secondary" className="text-xs">
                  +{permissions.length - 20} more
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              User Management Section
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {canViewUsers ? (
              <Alert>
                <Unlock className="h-4 w-4" />
                <AlertDescription>
                  ✅ You can view this section (has 'GET.users.list' permission)
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  ❌ This section is hidden (requires 'GET.users.list' permission)
                </AlertDescription>
              </Alert>
            )}

            {canViewUsers && (
              <div className="space-y-2">
                <Button className="w-full" variant="outline" size="sm">
                  View All Users
                </Button>
                
                {canCreateUser ? (
                  <Button className="w-full" size="sm">
                    Create New User
                  </Button>
                ) : (
                  <Button className="w-full" size="sm" disabled>
                    Create New User (No Permission)
                  </Button>
                )}
                
                {canDeleteUser ? (
                  <Button className="w-full" variant="destructive" size="sm">
                    Delete User
                  </Button>
                ) : (
                  <Button className="w-full" variant="outline" size="sm" disabled>
                    Delete User (No Permission)
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Course Management Section
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {canViewCourses ? (
              <Alert>
                <Unlock className="h-4 w-4" />
                <AlertDescription>
                  ✅ You can view this section (has course-related permissions)
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  ❌ This section is hidden (requires course permissions)
                </AlertDescription>
              </Alert>
            )}

            {canViewCourses && (
              <div className="space-y-2">
                <Button className="w-full" variant="outline" size="sm">
                  View All Courses
                </Button>
                
                {canCreateCourse ? (
                  <Button className="w-full" size="sm">
                    Create New Course
                  </Button>
                ) : (
                  <Button className="w-full" size="sm" disabled>
                    Create New Course (No Permission)
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4" />
              System Settings Section
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {canManageSettings ? (
              <Alert>
                <Unlock className="h-4 w-4" />
                <AlertDescription>
                  ✅ You can view this section (has 'PATCH.users.profile' permission)
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  ❌ This section is hidden (requires 'PATCH.users.profile' permission)
                </AlertDescription>
              </Alert>
            )}

            {canManageSettings && (
              <div className="space-y-2">
                <Button className="w-full" variant="outline" size="sm">
                  View System Settings
                </Button>
                <Button className="w-full" size="sm">
                  Update Configuration
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Admin-Only Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isAdmin ? (
              <Alert>
                <Unlock className="h-4 w-4" />
                <AlertDescription>
                  ✅ You can see admin actions (has 'admin' role)
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  ❌ Admin-only section (requires 'admin' role)
                </AlertDescription>
              </Alert>
            )}

            {isAdmin && (
              <div className="space-y-2">
                <Button className="w-full" variant="destructive" size="sm">
                  Delete All Data
                </Button>
                <Button className="w-full" variant="outline" size="sm">
                  Manage Roles & Permissions
                </Button>
                <Button className="w-full" size="sm">
                  View System Logs
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Usage Example with Recoil Selectors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p className="font-medium">How to use in your components:</p>
            <pre className="bg-muted p-3 rounded-md overflow-x-auto">
{`import { useRecoilValue } from 'recoil'
import {
  currentUserState,
  userPermissionsSelector,
} from '@/global/recoil/user'

function MyComponent() {
  const user = useRecoilValue(currentUserState)
  const permissions = useRecoilValue(userPermissionsSelector)
  
  // Check single permission
  const canView = permissions.some(p => p.key === 'GET.users.list')
  
  // Check multiple permissions (any of)
  const canManage = permissions.some(p => 
    ['POST.users.create', 'DELETE.users.:id'].includes(p.key)
  )
  
  // Check role
  const isAdmin = user?.role === 'admin'
  
  return (
    <>
      {canView && <button>View Users</button>}
      {canManage && <button>Manage Users</button>}
      {isAdmin && <button>Admin Panel</button>}
    </>
  )
}`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
