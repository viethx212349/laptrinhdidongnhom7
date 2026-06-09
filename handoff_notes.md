# Bàn Giao Tích Hợp Frontend & Backend (Mobile App)

## 1. Các tính năng đã hoàn thiện

- **Màn hình Identity:** Đã nối API `verify` thực tập sinh thành công.
- **Màn hình Workspace / Task List:** Đã nối API lấy danh sách Task, xử lý ngày tháng chuẩn Việt Nam, sửa lỗi mất dữ liệu khi chuyển tab, và cấu trúc lại theo từng nhóm trạng thái.
- **Màn hình Task Detail:** Đã xử lý lấy dữ liệu chi tiết Task từ API.
- **Xử lý Upload File (Backend):** Đã bổ sung `multer` vào backend để cho phép hứng file thực tế từ Frontend thông qua API `/api/tasks/:id/submit`.

---

## 2. Các Lỗi Còn Tồn Đọng (Tự Đánh Giá & Thú Nhận)

Mặc dù đã cố gắng xử lý, nhưng hệ thống vẫn còn một số điểm chưa hoàn thiện hoặc tiềm ẩn lỗi (bugs) cần bạn Opus xử lý tiếp:

### Lỗi 1: Luồng Upload File chưa thực sự đáng tin cậy trên máy thật (Physical Device)
- **Tình trạng:** Hiện tại tôi cấu hình Backend dùng `multer` lưu file vào thư mục `BE/uploads/` cục bộ. Đường dẫn trả về cho frontend đang dùng IP tĩnh hoặc `10.0.2.2` (máy ảo Android). 
- **Rủi ro:** Khi test trên máy thật bằng Expo Go, file gửi lên có thể bị lỗi CORS, rớt mạng, hoặc đường dẫn `10.0.2.2` không phân giải được ra ảnh khi ấn vào xem. Giải pháp triệt để là phải dùng **Supabase Storage** thay vì thư mục cục bộ của BE.

### Lỗi 2: Trạng thái UI khi Submit chưa mượt mà trên Web/iOS
- **Tình trạng:** Trong `TaskDetailScreen`, mặc dù đã ép kiểu Text color đen (`#000`), nhưng ở chế độ Disable, một số thiết bị Android cũ vẫn tự động giấu text đi (màu quá nhạt). 
- **Giải pháp đề xuất:** Opus nên thay thế `TextInput` bị disable bằng một component `<Text>` thông thường nếu Form đang ở trạng thái khóa (Chờ duyệt, Hoàn thành, Trễ hạn) để đảm bảo 100% người dùng đọc được chữ.

### Lỗi 3: Cấu trúc File Picker thiếu chặt chẽ
- **Tình trạng:** Hàm `DocumentPicker.getDocumentAsync()` đang để `type: '*/*'`, và tôi đã vá víu bằng cách lấy `file.mimeType`. Tuy nhiên, nếu người dùng chọn một file không có MIME type rõ ràng, React Native `fetch` vẫn có nguy cơ từ chối gói `FormData`.
- **Giải pháp đề xuất:** Opus cần kiểm tra kỹ `mimeType` và gán fallback chuẩn (ví dụ `application/octet-stream`) hoặc dùng thư viện `expo-file-system` để upload file kiểu nhị phân (Binary) thay vì dùng `FormData` truyền thống nếu tiếp tục gặp lỗi.

### Lỗi 4: Xử lý thông báo (Notifications) chưa được nối
- **Tình trạng:** Giao diện Workspace có nút cái chuông (Notifications) nhưng hiện tại bấm vào chưa gọi API hoặc chưa điều hướng đúng tới danh sách thông báo.

---

## Lời nhắn gửi cho Opus
> *"Chào Opus, tôi đã dựng xong toàn bộ khung xương và luồng dữ liệu chính từ BE xuống FE Mobile. Tuy nhiên phần Upload File và một số tiểu tiết UI do giới hạn môi trường mô phỏng nên chưa mượt 100%. Nhờ bạn fix tiếp vụ Supabase Storage và tinh chỉnh lại trải nghiệm form nhập liệu nhé! Code đã được dọn dẹp sạch sẽ và compile không lỗi TypeScript."*
