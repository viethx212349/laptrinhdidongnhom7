# BÁO CÁO: THIẾT KẾ VÀ LẬP TRÌNH GIAO DIỆN INTERNFLOW (MOBILE APP)

## 1. Phân tích Bản vẽ (Wireframe)
Giao diện được yêu cầu là Màn hình Workspace (Dashboard) chứa danh sách các Công việc (Task) dành cho Thực tập sinh. Dựa trên bản vẽ wireframe cung cấp, màn hình được phân rã thành 5 thành phần UI chính:
- **Header Top:** Tiêu đề "My Workspace" to, in đậm và biểu tượng Chuông thông báo góc phải (có chấm đỏ báo hiệu).
- **Tab Filter (Lọc trạng thái):** Thanh trượt ngang chứa 4 trạng thái (IN PROGRESS, IN REVIEW, DONE, REJECTED). Tab đang được chọn sẽ nổi bật nhờ đổi màu nền thành trắng và có hiệu ứng đổ bóng.
- **List Header:** Hiển thị tổng số lượng công việc (Vd: "ACTIVE ASSIGNMENTS (3)") kèm nút bộ lọc.
- **Task List (Danh sách công việc):** Các thẻ "Task Card" lặp lại hiển thị thông tin chi tiết (Tên Task, Tên Mentor, Ngày giao).
- **Bottom Navigation:** Thanh điều hướng ở dưới cùng màn hình với 2 tab chính là WORKSPACE (đang active) và PROFILE.

## 2. Lựa chọn Công nghệ & Kiến trúc Mã nguồn
Dự án được xây dựng bằng **React Native (Expo)** và sử dụng ngôn ngữ **TypeScript** nhằm đảm bảo tính cấu trúc và bắt lỗi chặt chẽ (Type Safety).
Các thành phần giao diện được áp dụng tư tưởng Component-based:
- `src/components/TaskCard.tsx`: Tái cấu trúc (Tách riêng) UI của 1 thẻ công việc duy nhất thành một phần tử độc lập. Thẻ này nhận các props (dữ liệu truyền vào) như tên, mentor, ngày giờ để tự render ra cấu trúc.
- `src/screens/Intern/TaskListScreen.tsx`: Màn hình ghép nối. Sử dụng thẻ `ScrollView` để làm thanh Tab trượt ngang và `FlatList` để hiển thị danh sách các `TaskCard` nhịp nhàng, tối ưu hóa bộ nhớ cho điện thoại khi danh sách kéo dài hàng trăm thẻ.
- `App.tsx`: Nơi khởi chạy ứng dụng ảo, ráp thân màn hình cùng thanh Bottom Navigation.

## 3. Kỹ thuật Hiện thực hóa (Coding Techniques)
- **Màu sắc & Phân cấp (Hierarchy):** Sử dụng nền xám sáng (`#FAFAFA`) cho bố cục tổng thể nhằm làm nổi bật khối thẻ Task nền trắng tinh (`#FFFFFF`). Font chữ có sự phân cấp (FontSize & FontWeight) rõ rệt để định điều hướng ánh nhìn của User.
- **Hiệu ứng vật lý (Shadow/Elevation):** Áp dụng thuộc tính Shadow của nền tảng iOS và Elevation của nền tảng Android để tạo độ nổi (3D mờ) cho các thẻ công việc và thanh Tab đang active, bám sát y hệt thiết kế.
- **Tối ưu trải nghiệm (UX):** Áp dụng `SafeAreaView` để giúp giao diện thông minh tự tránh bị "lẹm" vào khu vực tai thỏ (notch) của iPhone hay thanh trạng thái System của Android.

## 4. Giải thích Logic cốt lõi (State & Props)
Mặc dù đây mới là giao diện (Front-end), nhưng các khái niệm nền tảng của React Native vẫn được áp dụng triệt để nhằm chuẩn bị ráp nối với Backend:
- **State (Trạng thái nội bộ):** Sử dụng Hook `useState` bên trong `TaskListScreen` để lưu trữ biến `activeTab`. Khi người dùng bấm vào các Tab lọc (Ví dụ: bấm vào IN REVIEW), hàm `setActiveTab` sẽ thay đổi State. Giao diện lập tức phát hiện sự thay đổi này và Re-render (hiển thị lại) nhằm đưa Tab đó về trạng thái "Đang chọn" (đổi sang nền trắng, kích hoạt hiệu ứng 3D).
- **Props (Thuộc tính truyền tải):** Thẻ `TaskCard` là một thành phần "câm" (Dumb Component), nó không tự sinh ra dữ liệu. Thay vào đó, dữ liệu của mỗi công việc (Từ danh sách khởi tạo `MOCK_TASKS`) được truyền thụ động từ Component cha (`TaskListScreen`) xuống Component con (`TaskCard`) thông qua `props.task`. Nhờ thiết kế này, `TaskCard` có tính điểm tái sử dụng tối đa. Nhóm chỉ cần giữ nguyên code, sau này thay vì dùng MOCK_TASKS, nhóm ghép API fetch từ Backend Server nhồi vào Props là hệ thống tự động chạy thật 100%.
