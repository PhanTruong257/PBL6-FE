# Tính năng Chấm bài và Nhận xét

## Tổng quan

Tính năng này cho phép giáo viên xem chi tiết bài làm của học sinh và chấm điểm/thêm nhận xét cho các câu trả lời.

## Các tính năng chính

### 1. Hiển thị chi tiết câu trả lời

- **Câu trắc nghiệm một đáp án**: Hiển thị đúng/sai với icon ✓/✗
- **Câu trắc nghiệm nhiều đáp án**: Hiển thị điểm số, có thể chỉnh sửa
- **Câu tự luận**: Hiển thị điểm số, có thể chỉnh sửa

### 2. Chỉnh sửa điểm

#### Đối với câu tự luận và nhiều đáp án:
- Click vào icon bút ✏️ bên cạnh điểm số
- Nhập điểm mới
- Click ✓ để lưu tạm hoặc ✗ để hủy
- Điểm được lưu trong state local, chưa gửi lên server

### 3. Thêm/Sửa nhận xét

- Click vào nút "Thêm nhận xét" hoặc icon 💬 bên cạnh nhận xét hiện có
- Nhập nhận xét trong dialog popup
- Nhận xét được lưu trong state local, chưa gửi lên server

### 4. Submit kết quả

- Sau khi chỉnh sửa điểm và nhận xét, click nút "Xác nhận kết quả (X thay đổi)"
- Tất cả các thay đổi sẽ được gửi lên server trong một lần
- Sau khi thành công, tự động redirect về danh sách submissions

## Cấu trúc Code

### Hook: `use-submission-detail.ts`

```typescript
const {
  submission,           // Dữ liệu submission
  isLoading,           // Loading state khi fetch data
  isSubmitting,        // Loading state khi submit
  hasEdits,            // Boolean - có thay đổi nào chưa?
  editingAnswerId,     // ID của câu trả lời đang edit
  editedAnswers,       // Object chứa các thay đổi
  
  // Actions
  handleEditAnswer,     // Bắt đầu edit một câu trả lời
  handleUpdatePoints,   // Cập nhật điểm
  handleUpdateComment,  // Cập nhật nhận xét
  handleSaveAnswer,     // Lưu câu trả lời đang edit
  handleCancelEdit,     // Hủy edit
  handleSubmitGrades,   // Submit tất cả thay đổi
  getAnswerValue,       // Lấy giá trị hiện tại (edited hoặc original)
  isAnswerEdited,       // Kiểm tra câu trả lời đã được edit chưa
  handleBack,           // Quay lại danh sách
} = useSubmissionDetail(submissionId, examId)
```

### State Management

Hook sử dụng `useState` để quản lý:

```typescript
// Lưu trữ các thay đổi theo format:
editedAnswers = {
  42: {
    answer_id: 42,
    points_earned: "5",
    comment: "Làm tốt!"
  },
  43: {
    answer_id: 43,
    points_earned: "7.5",
    comment: "Cần cải thiện phần giải thích"
  }
}
```

### API Integration

#### Mock Mode
Đặt `USE_MOCK_API = true` trong `use-submission-detail.ts` để sử dụng mock API:
- Delay 1 giây để giả lập network request
- Log dữ liệu ra console
- Vẫn redirect về danh sách sau khi "submit"

#### Real API Mode
Đặt `USE_MOCK_API = false` để sử dụng API thật:
- Gọi `updateAnswerGrades(submissionId, answers)`
- Endpoint: `PUT /submissions/${submissionId}/answers`
- Body:
```json
{
  "answers": [
    {
      "answer_id": 42,
      "points_earned": "5",
      "comment": "Làm tốt!"
    }
  ]
}
```

## UI/UX Features

### Visual Indicators
- **Border xanh**: Câu trả lời đã được chỉnh sửa
- **Badge "Đã chỉnh sửa"**: Hiển thị trên câu đã edit
- **Button "Xác nhận kết quả"**: Chỉ hiển thị khi có thay đổi, hiển thị số lượng thay đổi

### Color Coding cho đáp án trắc nghiệm
- **Xanh lá đậm**: Đáp án đúng mà học sinh đã chọn
- **Đỏ**: Đáp án sai mà học sinh đã chọn
- **Xanh lá nhạt**: Đáp án đúng (chưa chọn)

### Loading States
- Spinner khi đang load dữ liệu
- Button disabled + spinner khi đang submit

## Testing

1. **Test chỉnh sửa điểm**:
   - Mở một submission detail
   - Click edit trên câu tự luận
   - Thay đổi điểm
   - Kiểm tra UI hiển thị badge "Đã chỉnh sửa"
   - Kiểm tra button "Xác nhận kết quả" hiển thị

2. **Test thêm nhận xét**:
   - Click "Thêm nhận xét"
   - Nhập text
   - Lưu
   - Kiểm tra nhận xét hiển thị

3. **Test submit**:
   - Chỉnh sửa nhiều câu
   - Click "Xác nhận kết quả"
   - Kiểm tra console log (nếu dùng mock)
   - Kiểm tra redirect về danh sách

4. **Test cancel**:
   - Bắt đầu edit một câu
   - Click ✗ để hủy
   - Kiểm tra thay đổi không được lưu

## Notes

- Tất cả thay đổi chỉ được lưu local cho đến khi click "Xác nhận kết quả"
- Nếu refresh trang, tất cả thay đổi sẽ mất
- API endpoint có thể cần điều chỉnh dựa trên backend implementation
- Có thể dễ dàng chuyển đổi giữa mock và real API bằng cách thay đổi `USE_MOCK_API`
