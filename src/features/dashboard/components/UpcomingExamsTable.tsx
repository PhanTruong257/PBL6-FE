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
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { format } from "date-fns";

export interface Exam {
  id: string;
  title: string;
  courseName: string;
  date: Date;
  duration: number; // in minutes
  status: "scheduled" | "completed" | "missed";
}

export interface UpcomingExamsTableProps {
  exams: Exam[];
}

export function UpcomingExamsTable({ exams }: UpcomingExamsTableProps) {
  const { t } = useTranslation();

  const getStatusBadge = (status: Exam["status"]) => {
    switch (status) {
      case "scheduled":
        return <Badge variant="outline">{t("Scheduled")}</Badge>;
      case "completed":
        return <Badge variant="secondary">{t("Completed")}</Badge>;
      case "missed":
        return <Badge variant="destructive">{t("Missed")}</Badge>;
      default:
        return null;
    }
  };

  if (exams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
        <p className="text-muted-foreground">{t("No upcoming exams found")}</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("Exam Title")}</TableHead>
            <TableHead>{t("Course")}</TableHead>
            <TableHead>{t("Date & Time")}</TableHead>
            <TableHead>{t("Duration")}</TableHead>
            <TableHead>{t("Status")}</TableHead>
            <TableHead>{t("Actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exams.map((exam) => (
            <TableRow key={exam.id}>
              <TableCell className="font-medium">{exam.title}</TableCell>
              <TableCell>{exam.courseName}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{format(exam.date, "MMM dd, yyyy HH:mm")}</span>
                </div>
              </TableCell>
              <TableCell>{exam.duration} {t("min")}</TableCell>
              <TableCell>{getStatusBadge(exam.status)}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" asChild>
                  <a href={`/exams/${exam.id}`}>
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

export default UpcomingExamsTable;