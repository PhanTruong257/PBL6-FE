# Submissions Feature Documentation

## Tổng quan
Tính năng xem và quản lý các bài nộp (submissions) của học sinh cho mỗi bài kiểm tra.

## Các tính năng chính

### 1. Xem danh sách bài nộp
- Hiển thị tất cả bài nộp của một bài kiểm tra cụ thể
- Hỗ trợ phân trang (mặc định 10 bài nộp/trang)
- Hiển thị thông tin:
  - Mã bài nộp
  - ID học sinh
  - Trạng thái (Đang làm, Đã nộp, Đã hủy, Đã chấm)
  - Điểm số (nếu đã chấm)
  - Số câu đã trả lời
  - Thời gian nộp

### 2. Xem chi tiết bài nộp
- Hiển thị thông tin chi tiết bài nộp
- Xem tất cả câu hỏi và câu trả lời của học sinh
- Hiển thị điểm cho từng câu
- Hiển thị nhận xét của giáo viên (nếu có)

## Cấu trúc file

### API Layer
```
features/exam/api/submissions.ts
```
- `getSubmissionsByExam()` - Lấy danh sách bài nộp theo exam ID
- `getSubmissionById()` - Lấy chi tiết một bài nộp
- `gradeSubmission()` - Chấm điểm bài nộp (sẽ implement sau)

### Pages
```
features/exam/pages/submissions-list.tsx
features/exam/pages/submission-detail.tsx
```

### Routes
```
routes/exam/$examId.submissions.index.tsx
routes/exam/$examId.submissions.$submissionId.tsx
```

### Types
```typescript
// types/exam.ts

export enum SubmissionStatus {
  IN_PROGRESS = 'in_progress',
  SUBMITTED = 'submitted',
  CANCELLED = 'cancelled',
  GRADED = 'graded',
}

export interface SubmissionWithDetails extends Submission {
  status: SubmissionStatus
  current_question_order?: number
  remaining_time?: number
  answers: Array<SubmissionAnswer & {
    question: Question
  }>
  exam: Exam
}
```

## Cách sử dụng

### 1. Từ danh sách bài kiểm tra
1. Vào trang danh sách bài kiểm tra: `/exam/`
2. Click vào icon "Users" (màu tím) ở cột "Thao tác"
3. Hệ thống sẽ chuyển đến trang danh sách bài nộp

### 2. Xem danh sách bài nộp
**URL:** `/exam/{examId}/submissions/`

**Query Parameters:**
- `page` (optional) - Số trang, mặc định là 1
- `limit` (optional) - Số bài nộp mỗi trang, mặc định là 10

**Ví dụ:**
```
/exam/123/submissions/
/exam/123/submissions/?page=2
/exam/123/submissions/?page=1&limit=20
```

### 3. Xem chi tiết bài nộp
**URL:** `/exam/{examId}/submissions/{submissionId}`

**Ví dụ:**
```
/exam/123/submissions/456
```

## API Endpoints

### Backend API (đã implement)
```
GET /exams/submissions/exam/:examId?page=1&limit=10
Response:
{
  "data": [...],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}

GET /exams/submissions/:submissionId
Response: SubmissionWithDetails

PUT /exams/submissions/:submissionId/grade
Body: {
  "score": number,
  "teacher_feedback": string,
  "graded_by": number
}
```

## UI Components

### SubmissionsListPage
- Header với nút back
- Card hiển thị danh sách
- Table với các cột: Mã, Học sinh, Trạng thái, Điểm, Số câu, Thời gian, Thao tác
- Pagination controls

### SubmissionDetailPage
- Header với nút back
- Card thông tin bài nộp (học sinh, điểm, thời gian, nhận xét)
- Card danh sách câu trả lời với:
  - Câu hỏi
  - Các lựa chọn (nếu là MCQ)
  - Câu trả lời của học sinh
  - Điểm số
  - Nhận xét (nếu có)

## Trạng thái và màu sắc

| Status | Label | Color |
|--------|-------|-------|
| in_progress | Đang làm | Blue |
| submitted | Đã nộp | Yellow |
| cancelled | Đã hủy | Red |
| graded | Đã chấm | Green |

## Tính năng sẽ phát triển

1. **Chấm điểm tự động** - Tự động chấm câu trắc nghiệm
2. **Chấm điểm thủ công** - Cho phép giáo viên chấm và nhận xét
3. **Export kết quả** - Xuất danh sách điểm ra Excel
4. **Thống kê** - Biểu đồ phân bố điểm, độ khó câu hỏi
5. **Lọc và tìm kiếm** - Lọc theo trạng thái, học sinh
6. **So sánh bài làm** - So sánh nhiều bài làm của học sinh khác nhau

## Notes

- Tất cả routes sử dụng `as any` để bypass TypeScript type checking cho navigation vì routes mới chưa được generate trong `routeTree.gen.ts`
- Sau khi chạy development server, Tanstack Router sẽ tự động generate lại routes
- API pagination mặc định là 10 items/page theo yêu cầu
