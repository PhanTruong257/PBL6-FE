import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BookOpen,
  CheckCircle,
  Clock,
  CalendarDays,
  Users,
  FileSpreadsheet,
  BarChart2,
  BookCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecentCoursesTable } from "./components/RecentCoursesTable";
import { UpcomingExamsTable } from "./components/UpcomingExamsTable";
import { mockRecentCourses, mockUpcomingExams } from "./mock-data";
import { useAuthStore } from "@/store/auth-store";
import { USER_ROLE } from "@/types/auth";

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("overview");

  // Get user role with fallback to student
  const userRole = user?.role || USER_ROLE.STUDENT;

  // Date greeting based on time of day
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard.goodMorning');
    if (hour < 18) return t('dashboard.goodAfternoon');
    return t('dashboard.goodEvening');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {getTimeBasedGreeting()}, {user?.name || t('dashboard.guest')}
        </h1>
        <p className="text-muted-foreground">
          {t('dashboard.dashboardSubtitle')}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">{t('dashboard.overview')}</TabsTrigger>
          {userRole === USER_ROLE.ADMIN && (
            <TabsTrigger value="analytics">{t('dashboard.analytics')}</TabsTrigger>
          )}
          <TabsTrigger value="courses">{t('dashboard.courses')}</TabsTrigger>
          <TabsTrigger value="exams">{t('dashboard.exams')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Stats cards - different cards for different roles */}
            {userRole === USER_ROLE.STUDENT && (
              <>
                <StatsCard
                  icon={<BookOpen className="h-6 w-6" />}
                  title={t('dashboard.enrolledCourses')}
                  value="5"
                  subtitle={t('dashboard.enrolledCoursesDesc')}
                />
                <StatsCard
                  icon={<CheckCircle className="h-6 w-6" />}
                  title={t('dashboard.completedCourses')}
                  value="3"
                  subtitle={t('dashboard.completedCoursesDesc')}
                />
                <StatsCard
                  icon={<Clock className="h-6 w-6" />}
                  title={t('dashboard.hoursLearned')}
                  value="42"
                  subtitle={t('dashboard.hoursLearnedDesc')}
                />
                <StatsCard
                  icon={<FileSpreadsheet className="h-6 w-6" />}
                  title={t('dashboard.upcomingExams')}
                  value="2"
                  subtitle={t('dashboard.upcomingExamsDesc')}
                />
              </>
            )}

            {userRole === USER_ROLE.TEACHER && (
              <>
                <StatsCard
                  icon={<BookOpen className="h-6 w-6" />}
                  title={t('dashboard.activeCourses')}
                  value="3"
                  subtitle={t('dashboard.activeCoursesDesc')}
                />
                <StatsCard
                  icon={<Users className="h-6 w-6" />}
                  title={t('dashboard.totalStudents')}
                  value="78"
                  subtitle={t('dashboard.totalStudentsDesc')}
                />
                <StatsCard
                  icon={<FileSpreadsheet className="h-6 w-6" />}
                  title={t('dashboard.pendingAssignments')}
                  value="15"
                  subtitle={t('dashboard.pendingAssignmentsDesc')}
                />
                <StatsCard
                  icon={<CalendarDays className="h-6 w-6" />}
                  title={t('dashboard.upcomingClasses')}
                  value="5"
                  subtitle={t('dashboard.upcomingClassesDesc')}
                />
              </>
            )}

            {userRole === USER_ROLE.ADMIN && (
              <>
                <StatsCard
                  icon={<BookOpen className="h-6 w-6" />}
                  title={t('dashboard.totalCourses')}
                  value="32"
                  subtitle={t('dashboard.totalCoursesDesc')}
                />
                <StatsCard
                  icon={<Users className="h-6 w-6" />}
                  title={t('dashboard.totalUsers')}
                  value="215"
                  subtitle={t('dashboard.totalUsersDesc')}
                />
                <StatsCard
                  icon={<Users className="h-6 w-6" />}
                  title={t('dashboard.totalTeachers')}
                  value="12"
                  subtitle={t('dashboard.totalTeachersDesc')}
                />
                <StatsCard
                  icon={<Users className="h-6 w-6" />}
                  title={t('dashboard.totalStudents')}
                  value="203"
                  subtitle={t('dashboard.totalStudentsDesc')}
                />
              </>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.recentCourses')}</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentCoursesTable courses={mockRecentCourses} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.upcomingExams')}</CardTitle>
              </CardHeader>
              <CardContent>
                <UpcomingExamsTable exams={mockUpcomingExams} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {userRole === USER_ROLE.ADMIN && (
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t('dashboard.courseEnrollments')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    {/* Chart will be added here */}
                    <div className="flex h-full items-center justify-center border rounded-md">
                      <BarChart2 className="h-10 w-10 text-muted-foreground" />
                      <p className="ml-2 text-muted-foreground">{t('dashboard.chartPlaceholder')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('dashboard.userStatistics')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    {/* Chart will be added here */}
                    <div className="flex h-full items-center justify-center border rounded-md">
                      <BarChart2 className="h-10 w-10 text-muted-foreground" />
                      <p className="ml-2 text-muted-foreground">{t('dashboard.chartPlaceholder')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}

        <TabsContent value="courses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.yourCourses')}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Course list will go here */}
              <div className="flex h-[300px] items-center justify-center border rounded-md">
                <BookCheck className="h-10 w-10 text-muted-foreground" />
                <p className="ml-2 text-muted-foreground">{t('dashboard.coursesPlaceholder')}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exams" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {userRole === USER_ROLE.STUDENT
                  ? t('dashboard.yourUpcomingExams')
                  : t('dashboard.managedExams')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Exams list will go here */}
              <div className="flex h-[300px] items-center justify-center border rounded-md">
                <FileSpreadsheet className="h-10 w-10 text-muted-foreground" />
                <p className="ml-2 text-muted-foreground">{t('dashboard.examsPlaceholder')}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
}

function StatsCard({ icon, title, value, subtitle }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}