import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export interface Course {
  id: string;
  name: string;
  instructorName: string;
  instructorAvatar: string;
  category: string;
  status: "active" | "completed" | "upcoming";
  progress?: number;
}

export interface RecentCoursesTableProps {
  courses: Course[];
}

export function RecentCoursesTable({ courses }: RecentCoursesTableProps) {
  const { t } = useTranslation();

  const getStatusBadge = (status: Course["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="default">{t("Active")}</Badge>;
      case "completed":
        return <Badge variant="secondary">{t("Completed")}</Badge>;
      case "upcoming":
        return <Badge variant="outline">{t("Upcoming")}</Badge>;
      default:
        return null;
    }
  };

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
        <p className="text-muted-foreground">{t("No recent courses found")}</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("Course Name")}</TableHead>
            <TableHead>{t("Instructor")}</TableHead>
            <TableHead>{t("Category")}</TableHead>
            <TableHead>{t("Status")}</TableHead>
            <TableHead>{t("Actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell className="font-medium">{course.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={course.instructorAvatar} alt={course.instructorName} />
                    <AvatarFallback>
                      {course.instructorName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{course.instructorName}</span>
                </div>
              </TableCell>
              <TableCell>{course.category}</TableCell>
              <TableCell>{getStatusBadge(course.status)}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" asChild>
                  <a href={`/courses/${course.id}`}>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default RecentCoursesTable;