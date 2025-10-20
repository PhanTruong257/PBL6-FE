import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  Trophy, 
  Clock, 
  CheckCircle,
  Star,
  Target,
  TrendingUp,
  Award
} from 'lucide-react'
import type { ProfileApiResponse } from '../api'

interface ProfileStatsProps {
  profile: ProfileApiResponse
}

// Mock data - In real app, this would come from APIs
const getMockStats = (role: string) => {
  const statsMap: Record<string, any> = {
    admin: {
      totalUsers: 1234,
      activeUsers: 987,
      totalCourses: 45,
      activeCourses: 38,
      totalTeachers: 23,
      totalStudents: 1211,
      systemUptime: '99.9%',
      lastLogin: '2 hours ago'
    },
    teacher: {
      totalStudents: 156,
      activeCourses: 5,
      completedCourses: 12,
      totalLessons: 89,
      averageRating: 4.8,
      totalReviews: 134,
      hoursTeached: 245,
      certificates: 3
    },
    user: {
      enrolledCourses: 8,
      completedCourses: 3,
      inProgressCourses: 5,
      totalPoints: 2450,
      certificates: 2,
      studyHours: 156,
      averageGrade: 85.5,
      streak: 12
    }
  }
  
  return statsMap[role] || statsMap.user
}

export const ProfileStats = ({ profile }: ProfileStatsProps) => {
  const role = profile.role.toLowerCase()
  const stats = getMockStats(role)

  // Admin Stats
  if (role === 'admin') {
    const adminStats = stats
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{adminStats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-600 font-medium">{adminStats.activeUsers}</span> active
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{adminStats.totalCourses}</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-600 font-medium">{adminStats.activeCourses}</span> active
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <GraduationCap className="h-4 w-4 mr-2" />
              Teachers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{adminStats.totalTeachers}</div>
            <p className="text-xs text-gray-500 mt-1">Active educators</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{adminStats.systemUptime}</div>
            <p className="text-xs text-gray-500 mt-1">Uptime</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Teacher Stats
  if (role === 'teacher') {
    const teacherStats = stats
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{teacherStats.totalStudents}</div>
            <p className="text-xs text-gray-500 mt-1">Total enrolled</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              Active Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{teacherStats.activeCourses}</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-gray-600">{teacherStats.completedCourses}</span> completed
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Star className="h-4 w-4 mr-2" />
              Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{teacherStats.averageRating}/5</div>
            <p className="text-xs text-gray-500 mt-1">
              {teacherStats.totalReviews} reviews
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Teaching Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{teacherStats.hoursTeached}</div>
            <p className="text-xs text-gray-500 mt-1">Total hours</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Student/User Stats
  const userStats = stats
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
            <BookOpen className="h-4 w-4 mr-2" />
            Enrolled Courses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{userStats.enrolledCourses}</div>
          <p className="text-xs text-gray-500 mt-1">
            <span className="text-green-600 font-medium">{userStats.inProgressCourses}</span> in progress
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Completed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{userStats.completedCourses}</div>
          <p className="text-xs text-gray-500 mt-1">Courses finished</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-yellow-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
            <Trophy className="h-4 w-4 mr-2" />
            Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{userStats.totalPoints.toLocaleString()}</div>
          <p className="text-xs text-gray-500 mt-1">Total earned</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
            <Award className="h-4 w-4 mr-2" />
            Certificates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{userStats.certificates}</div>
          <p className="text-xs text-gray-500 mt-1">Earned certificates</p>
        </CardContent>
      </Card>

      {/* Additional stats row */}
      <Card className="border-l-4 border-l-indigo-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Study Hours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-indigo-600">{userStats.studyHours}</div>
          <p className="text-xs text-gray-500 mt-1">Total hours</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-pink-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
            <Target className="h-4 w-4 mr-2" />
            Average Grade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-pink-600">{userStats.averageGrade}%</div>
          <p className="text-xs text-gray-500 mt-1">Overall performance</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-orange-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Study Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{userStats.streak}</div>
          <p className="text-xs text-gray-500 mt-1">Days in a row</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-teal-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
            <Star className="h-4 w-4 mr-2" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-teal-600">12</div>
          <p className="text-xs text-gray-500 mt-1">Unlocked</p>
        </CardContent>
      </Card>
    </div>
  )
}