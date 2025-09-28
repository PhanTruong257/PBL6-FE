import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ChevronDown,
  ChevronRight,
  Menu,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import type { UserRole } from "@/types/auth";
import { USER_ROLE } from "@/types/auth";

interface SidebarProps {
  role: UserRole;
  isCollapsed: boolean;
  isMobile: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCollapsedChange: () => void;
}

type NavItemWithChildren = {
  title: string;
  href?: string;
  icon?: LucideIcon;
  children?: NavItemWithChildren[];
  label?: string;
  isRoleAllowed?: UserRole[];
};

export function Sidebar({
  role,
  isCollapsed,
  isMobile,
  isOpen,
  onOpenChange,
  onCollapsedChange,
}: SidebarProps) {
  const { t } = useTranslation();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  // Navigate items based on roles
  const navItems: NavItemWithChildren[] = [
    {
      title: t("dashboard"),
      href: "/",
      icon: DashboardIcon,
    },
    {
      title: t("courses"),
      icon: CourseIcon,
      children: [
        {
          title: t("allCourses"),
          href: "/courses",
        },
        {
          title: t("enrolledCourses"),
          href: "/courses/enrolled",
          isRoleAllowed: [USER_ROLE.STUDENT],
        },
        {
          title: t("myCourses"),
          href: "/courses/my-courses",
          isRoleAllowed: [USER_ROLE.TEACHER],
        },
        {
          title: t("createCourse"),
          href: "/courses/create",
          isRoleAllowed: [USER_ROLE.ADMIN, USER_ROLE.TEACHER],
        },
      ],
    },
    {
      title: t("lessons"),
      icon: LessonIcon,
      isRoleAllowed: [USER_ROLE.ADMIN, USER_ROLE.TEACHER],
      children: [
        {
          title: t("allLessons"),
          href: "/lessons",
        },
        {
          title: t("createLesson"),
          href: "/lessons/create",
        },
      ],
    },
    {
      title: t("assignments"),
      icon: AssignmentIcon,
      children: [
        {
          title: t("allAssignments"),
          href: "/assignments",
        },
        {
          title: t("myAssignments"),
          href: "/assignments/my-assignments",
          isRoleAllowed: [USER_ROLE.STUDENT],
        },
        {
          title: t("createAssignment"),
          href: "/assignments/create",
          isRoleAllowed: [USER_ROLE.ADMIN, USER_ROLE.TEACHER],
        },
      ],
    },
    {
      title: t("users"),
      href: "/users",
      icon: UsersIcon,
      isRoleAllowed: [USER_ROLE.ADMIN],
    },
    {
      title: t("teachers"),
      href: "/teachers",
      icon: TeacherIcon,
      isRoleAllowed: [USER_ROLE.ADMIN],
    },
    {
      title: t("students"),
      href: "/students",
      icon: StudentIcon,
      isRoleAllowed: [USER_ROLE.ADMIN, USER_ROLE.TEACHER],
    },
    {
      title: t("classes"),
      href: "/classes",
      icon: ClassIcon,
    },
    {
      title: t("meetings"),
      href: "/meetings",
      icon: MeetingIcon,
    },
    {
      title: t("chats"),
      href: "/chats",
      icon: ChatIcon,
    },
    {
      title: t("exams"),
      icon: ExamIcon,
      children: [
        {
          title: t("allExams"),
          href: "/exams",
        },
        {
          title: t("myExams"),
          href: "/exams/my-exams",
          isRoleAllowed: [USER_ROLE.STUDENT],
        },
        {
          title: t("createExam"),
          href: "/exams/create",
          isRoleAllowed: [USER_ROLE.ADMIN, USER_ROLE.TEACHER],
        },
      ],
    },
    {
      title: t("settings"),
      href: "/settings",
      icon: SettingsIcon,
    },
  ];

  const handleGroupToggle = (title: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter((item) => {
    if (!item.isRoleAllowed) return true;
    return item.isRoleAllowed.includes(role);
  });

  // Toggle mobile sidebar
  const toggleSidebar = () => {
    if (!isMobile) {
      onCollapsedChange();
    }
  };

  // Component for the sidebar content
  const SidebarContent = () => (
    <div className={cn("flex h-full flex-col")}>
      <div className="flex h-14 items-center border-b px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          {!isCollapsed && <span>LMS Platform</span>}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={toggleSidebar}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
      <ScrollArea className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {filteredNavItems.map((item, index) => (
            <NavItem
              key={index}
              item={item}
              isCollapsed={isCollapsed}
              role={role}
              openGroups={openGroups}
              onToggle={handleGroupToggle}
            />
          ))}
        </nav>
      </ScrollArea>
    </div>
  );

  // For mobile view: use Sheet component
  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 p-0 md:hidden"
          onClick={() => onOpenChange(!isOpen)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
          <SheetContent side="left" className="p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </>
    );
  }

  // For desktop view
  return (
    <div
      className={cn(
        "group flex flex-col bg-background border-r transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <SidebarContent />
    </div>
  );
}

// Navigation item component
function NavItem({
  item,
  isCollapsed,
  role,
  openGroups,
  onToggle,
}: {
  item: NavItemWithChildren;
  isCollapsed: boolean;
  role: UserRole;
  openGroups: Record<string, boolean>;
  onToggle: (title: string) => void;
}) {
  // Check if the item should be rendered for this role
  if (item.isRoleAllowed && !item.isRoleAllowed.includes(role)) {
    return null;
  }

  // Check if this item has children
  const hasChildren = item.children && item.children.length > 0;
  const isOpen = openGroups[item.title] || false;

  // Filter children based on role
  const filteredChildren =
    item.children?.filter((child) => {
      if (!child.isRoleAllowed) return true;
      return child.isRoleAllowed.includes(role);
    }) || [];

  // If there are no accessible children, don't render the parent if it has no href
  if (hasChildren && filteredChildren.length === 0 && !item.href) {
    return null;
  }

  const Icon = item.icon;

  // Render item with children as a dropdown
  if (hasChildren && filteredChildren.length > 0) {
    return (
      <div>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start",
            isCollapsed && "justify-center px-0"
          )}
          onClick={() => !isCollapsed && onToggle(item.title)}
        >
          {Icon && <Icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />}
          {!isCollapsed && (
            <>
              <span className="flex-1 text-left">{item.title}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            </>
          )}
        </Button>
        {!isCollapsed && isOpen && (
          <div className="ml-4 mt-1 grid gap-1">
            {filteredChildren.map((child, index) => (
              <NavItem
                key={index}
                item={child}
                isCollapsed={isCollapsed}
                role={role}
                openGroups={openGroups}
                onToggle={onToggle}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Render simple item with a link
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start",
        isCollapsed && "justify-center px-0"
      )}
      asChild
    >
      <Link to={item.href || "#"}>
        {Icon && <Icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />}
        {!isCollapsed && <span>{item.title}</span>}
      </Link>
    </Button>
  );
}

// Icons (placeholders)
const DashboardIcon = React.forwardRef<SVGSVGElement>((props, ref) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
     ref={ref}>
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
});

const CourseIcon = React.forwardRef<SVGSVGElement>((props, ref) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
     ref={ref}>
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
});

const LessonIcon = React.forwardRef<SVGSVGElement>((props, ref) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
     ref={ref}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
});

const AssignmentIcon = React.forwardRef<SVGSVGElement>((props, ref) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
     ref={ref}>
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="15" x2="15" y2="15" />
      <line x1="9" y1="11" x2="15" y2="11" />
    </svg>
  );
});

const UsersIcon = React.forwardRef<SVGSVGElement>((props, ref) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
     ref={ref}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
});

const TeacherIcon = React.forwardRef<SVGSVGElement>((props, ref) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
     ref={ref}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13 8h2" />
      <path d="M9 8h2" />
      <path d="M12 14v1" />
      <path d="M12 19v-1" />
    </svg>
  );
});

const StudentIcon = React.forwardRef<SVGSVGElement>((props, ref) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
     ref={ref}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
});

const ClassIcon = React.forwardRef<SVGSVGElement>((props, ref) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
     ref={ref}>
      <path d="M4 7V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2" />
      <path d="M18 21V9a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v12" />
      <path d="M2 21h20" />
      <path d="M12 10v6" />
      <path d="M9 13h6" />
    </svg>
  );
});

const MeetingIcon = React.forwardRef<SVGSVGElement>((props, ref) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
     ref={ref}>
      <path d="M15 10l5 5-5 5" />
      <path d="M4 4v7a4 4 0 0 0 4 4h11" />
    </svg>
  );
});

const ChatIcon = React.forwardRef<SVGSVGElement>((props, ref) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
     ref={ref}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
});

const ExamIcon = React.forwardRef<SVGSVGElement>((props, ref) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
     ref={ref}>
      <path d="M18 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-4-6z" />
      <path d="M8 13h8" />
      <path d="M8 17h8" />
      <path d="M10 9h4" />
    </svg>
  );
});

const SettingsIcon = React.forwardRef<SVGSVGElement>((props, ref) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
     ref={ref}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
});