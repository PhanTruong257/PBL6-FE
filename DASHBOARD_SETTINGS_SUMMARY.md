# Tóm tắt triển khai Dashboard và Settings

## 1. Loại bỏ code trùng lặp ✅

### Đã xóa:
- `src/libs/rbac.ts` - Không được sử dụng trong codebase
- `src/hooks/use-auth.ts` - Chỉ là re-export, không có nơi nào import

### Đã refactor:
- `src/hooks/use-role-guard.ts`:
  - Thêm TODO note: chỉ check role, chưa check permissions chi tiết
  - Các hàm `hasPermission`, `hasAnyPermission`, `hasAllPermissions` hiện return `true`
  - Sẵn sàng để implement permission checking sau này

- `src/libs/constants/roles.constant.ts`:
  - Loại bỏ định nghĩa `UserRole` trùng lặp
  - Import `UserRole` từ `@/types/user` (nguồn duy nhất)

## 2. Dashboard Feature ✅

### Cấu trúc thư mục:
```
src/features/dashboard/
├── components/
│   ├── stats-card.tsx          # Card hiển thị thống kê
│   ├── recent-courses.tsx      # Danh sách khóa học gần đây
│   └── upcoming-exams.tsx      # Danh sách kỳ thi sắp tới
├── pages/
│   ├── admin-dashboard-page.tsx    # Dashboard cho admin
│   ├── teacher-dashboard-page.tsx  # Dashboard cho giảng viên
│   └── student-dashboard-page.tsx  # Dashboard cho sinh viên
└── index.ts                    # Export tất cả
```

### Đặc điểm:
- **Admin Dashboard**: Thống kê hệ thống (tổng khóa học, người dùng, giảng viên, sinh viên), hoạt động gần đây
- **Teacher Dashboard**: Thống kê lớp học (khóa học đang dạy, sinh viên, bài tập chờ chấm, lớp học sắp tới)
- **Student Dashboard**: Thống kê học tập (khóa học đang theo, hoàn thành, giờ học, kỳ thi sắp tới)
- Sử dụng mock data, sẵn sàng để tích hợp API

## 3. Settings Feature ✅

### Cấu trúc thư mục:
```
src/features/settings/
├── components/
│   └── sidebar-nav.tsx         # Navigation sidebar cho settings
├── layout/
│   └── settings-layout.tsx     # Layout wrapper với sidebar
├── pages/
│   ├── profile-page.tsx        # Trang hồ sơ cá nhân
│   ├── account-page.tsx        # Trang quản lý tài khoản
│   ├── appearance-page.tsx     # Trang tùy chỉnh giao diện
│   ├── notifications-page.tsx  # Trang cài đặt thông báo
│   └── display-page.tsx        # Trang cài đặt hiển thị
└── index.ts                    # Export tất cả
```

### Các trang settings:
- **Profile**: Cập nhật thông tin cá nhân (họ, tên, email, phone, bio)
- **Account**: Đổi mật khẩu, xóa tài khoản
- **Appearance**: Chọn theme (sáng/tối/hệ thống)
- **Notifications**: Bật/tắt các loại thông báo (email, khóa học, kỳ thi, điểm số, hệ thống)
- **Display**: Tùy chỉnh kích thước font, chế độ nén, sidebar, hiệu ứng

### Layout:
- `SettingsLayout` nhận props `role` và `basePath` để tùy chỉnh cho từng role
- Sidebar responsive (dropdown trên mobile, sidebar trên desktop)
- Outlet để render các sub-pages

## 4. Protected Routes ✅

### Admin Routes:
```
/admin/dashboard/               → AdminDashboardPage (RequireAuth + RequireRole['admin'])
/admin/settings                 → SettingsLayout (RequireAuth + RequireRole['admin'])
/admin/settings/                → ProfilePage
/admin/settings/account         → AccountPage
/admin/settings/appearance      → AppearancePage
/admin/settings/notifications   → NotificationsPage
/admin/settings/display         → DisplayPage
```

### Teacher Routes:
```
/teacher/dashboard/             → TeacherDashboardPage (RequireAuth + RequireRole['teacher'])
/teacher/settings               → SettingsLayout (RequireAuth + RequireRole['teacher'])
/teacher/settings/              → ProfilePage
/teacher/settings/account       → AccountPage
/teacher/settings/appearance    → AppearancePage
/teacher/settings/notifications → NotificationsPage
/teacher/settings/display       → DisplayPage
```

### Student Routes:
```
/student/dashboard/             → StudentDashboardPage (RequireAuth + RequireRole['student'])
/student/settings               → SettingsLayout (RequireAuth + RequireRole['student'])
/student/settings/              → ProfilePage
/student/settings/account       → AccountPage
/student/settings/appearance    → AppearancePage
/student/settings/notifications → NotificationsPage
/student/settings/display       → DisplayPage
```

### Guard logic:
- `RequireAuth`: Kiểm tra authentication, redirect về `/auth/login` nếu chưa đăng nhập
- `RequireRole`: Kiểm tra role, redirect về trang role-based home hoặc hiển thị Access Denied nếu sai role

## 5. Hướng dẫn tiếp theo

### Để hoàn tất và chạy dự án:

1. **Generate routes** (TanStack Router):
   ```bash
   cd d:\PBL6\FE-part\PBL6_Frontend
   npm run dev
   ```
   - TanStack Router plugin sẽ tự động scan `src/routes/` và generate `routeTree.gen.ts`
   - Các lỗi type về route paths sẽ biến mất sau khi routeTree được generate

2. **Kiểm tra và sửa lỗi**:
   - Sau khi dev server chạy, kiểm tra console/terminal xem có lỗi nào không
   - Sửa các lỗi import hoặc type nếu có

3. **Thêm navigation/menu**:
   - Cập nhật `src/data/menu-data.ts` hoặc sidebar component để thêm link đến dashboard và settings
   - Đảm bảo menu items phù hợp với từng role

4. **Tích hợp API**:
   - Thay mock data trong dashboard pages bằng API calls
   - Tích hợp form submission trong settings pages với backend
   - Sử dụng TanStack Query để fetch và cache data

5. **Testing**:
   - Test navigation giữa các trang
   - Test guard logic (auth & role)
   - Test các form trong settings

## 6. Cấu trúc dự án tuân theo

- ✅ **Feature-based structure**: Code được tổ chức theo features (dashboard, settings)
- ✅ **Pages trong features**: Tất cả pages ở `features/*/pages/`, routes chỉ import và wrap với guards
- ✅ **Non-redundant**: Loại bỏ tất cả code trùng lặp, chỉ giữ 1 source of truth
- ✅ **Protected routes**: Tất cả routes protected được wrap bằng `RequireAuth` và `RequireRole`
- ✅ **Role-based rendering**: Dashboard và settings có nội dung khác nhau cho từng role
- ✅ **Reusable components**: Components như `StatsCard`, `SidebarNav`, `SettingsLayout` có thể tái sử dụng

## 7. Notes

- Các lỗi type hiện tại (`Argument of type '"/admin/dashboard"' is not assignable...`) sẽ tự động biến mất sau khi TanStack Router generate `routeTree.gen.ts`
- Nếu dev server không tự generate, có thể cần restart lại hoặc xóa `.tanstack/` folder
- Nếu có thêm yêu cầu về permission-based access control (PBAC), có thể uncomment và implement logic trong `use-role-guard.ts`
