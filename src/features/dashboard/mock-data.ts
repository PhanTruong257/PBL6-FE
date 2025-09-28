import type { Course } from "@/features/dashboard/components/RecentCoursesTable";
import type { Exam } from "@/features/dashboard/components/UpcomingExamsTable";

// Mock data for recent courses
export const mockRecentCourses: Course[] = [
  {
    id: "1",
    name: "Introduction to Web Development",
    instructorName: "John Smith",
    instructorAvatar: "https://i.pravatar.cc/150?img=1",
    category: "Web Development",
    status: "active",
    progress: 45,
  },
  {
    id: "2",
    name: "Advanced React Patterns",
    instructorName: "Emma Johnson",
    instructorAvatar: "https://i.pravatar.cc/150?img=2",
    category: "Frontend",
    status: "active",
    progress: 70,
  },
  {
    id: "3",
    name: "Database Design Fundamentals",
    instructorName: "Michael Brown",
    instructorAvatar: "https://i.pravatar.cc/150?img=3",
    category: "Database",
    status: "completed",
    progress: 100,
  },
  {
    id: "4",
    name: "Mobile App Development with Flutter",
    instructorName: "Sarah Davis",
    instructorAvatar: "https://i.pravatar.cc/150?img=4",
    category: "Mobile Development",
    status: "upcoming",
  },
  {
    id: "5",
    name: "Cloud Computing Essentials",
    instructorName: "David Wilson",
    instructorAvatar: "https://i.pravatar.cc/150?img=5",
    category: "Cloud",
    status: "active",
    progress: 30,
  },
];

// Mock data for upcoming exams
export const mockUpcomingExams: Exam[] = [
  {
    id: "1",
    title: "HTML & CSS Fundamentals",
    courseName: "Introduction to Web Development",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    duration: 60,
    status: "scheduled",
  },
  {
    id: "2",
    title: "React Hooks & Context API",
    courseName: "Advanced React Patterns",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    duration: 90,
    status: "scheduled",
  },
  {
    id: "3",
    title: "SQL Queries & Indexing",
    courseName: "Database Design Fundamentals",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    duration: 120,
    status: "completed",
  },
  {
    id: "4",
    title: "Flutter State Management",
    courseName: "Mobile App Development with Flutter",
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    duration: 75,
    status: "scheduled",
  },
  {
    id: "5",
    title: "AWS Core Services",
    courseName: "Cloud Computing Essentials",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    duration: 90,
    status: "missed",
  },
];