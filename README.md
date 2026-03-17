# Mini Browser Extension 🌐

Mini Browser là một tiện ích mở rộng mạnh mẽ cho Google Chrome, mang đến trải nghiệm trình duyệt thu nhỏ ngay gọn gàng bên cạnh tab làm việc chính của bạn.

Được phát triển và thiết kế bởi **Black Candy 🍫**.

---

## ✨ Tính Năng Nổi Bật

- **Duyệt web Song Song:** Mở bất kỳ trang web nào (từ công cụ tìm kiếm đến mạng xã hội) trực tiếp trên sidebar mà không cần đổi tab, giúp bạn vừa làm việc vừa tra cứu thông tin siêu tốc độ.
- **Tường lửa Iframe Bypass:** Trang bị engine tuỳ chỉnh loại bỏ các chứng chỉ chặn nhúng `X-Frame-Options`, `Content-Security-Policy` & `Sec-Fetch-*`. Chạy mượt mà từ ChatGPT, Gemini đến các trang web ngân hàng, hệ thống Email bảo mật cao (Gmail, Outlook).
- **Thiết Kế Glassmorphism:** Giao diện Apple Style siêu mượt mà, sử dụng thiết kế kính mờ làm tông chủ đạo, hoạt ảnh nhẹ nhàng sang trọng.
- **Lịch Sử & Ghim URL URL Yêu Thích:** 
   - Tự động lưu mọi URL bạn từng nhập.
   - Ghim (Pin ★) URL lên cực kỳ nhanh để tiện truy cập sau này.
   - Trích xuất biểu tượng Icon (Favicon) tự động cho từng link.
- **Công cụ nhập liệu thần tốc:** Sao chép/Paste trong 1 chạm (📋) và Xóa rỗng input linh hoạt (✕).
- **Dropdown List Truy Cập Nhanh:** Menu list ẩn hiển thị danh sách các trang web đã ghim ngay trên Navbar điều hướng của ứng dụng.

## 🚀 Hướng Dẫn Cài Đặt (Dành cho Developer)

1. Tải về hoặc Clone toàn bộ thư mục mã nguồn này.
2. Mở trình duyệt Google Chrome (hoặc Edge, Cốc Cốc, Brave).
3. Truy cập vào phần quản lý Tiện ích mở rộng tại: `chrome://extensions/`
4. Ở góc trên cùng bên phải, bật công tắc **Chế độ dành cho nhà phát triển (Developer mode)**.
5. Nhấn nút **Tải tiện ích đã giải nén (Load unpacked)** ở góc trên bên trái.
6. Duyệt đến thư mục chứa mã nguồn của Mini Browser và chọn nó.
7. Bạn đã cài đặt thành công! Ghim 📌 (Pin) tiện ích lên thanh trình duyệt và sử dụng nhé.

## 🛠️ Cấu Trúc Mã Nguồn

Dự án này sử dụng Manifest V3 (tiêu chuẩn mới nhất của Google Chrome):
- `manifest.json`: Trái tim khai báo các quyền hạn của ứng dụng (`sidePanel`, `declarativeNetRequest`, `storage`,..).
- `sidepanel.html` & `sidepanel.css`: Giao diện trình duyệt Sidebar và Menu cấu hình Setting (Được tích hợp chung để hiển thị mượt mà không phân trang).
- `sidepanel.js`: Bộ não điều khiển Logic DOM, LocalStorage & URL History engine.
- `background.js`: Service worker khổng lồ chạy ngầm (Chịu trách nhiệm bypass các quy tắc tường lửa Firewall của các trang lớn thông qua network interception).
- `icon/`: Hình ảnh bộ nhận diện thương hiệu Extension.

## 📝 Bản Quyền & Tác Giả

**Tác giả:** Black Candy 🍫  
*Được tạo ra với đam mê để đem tới trải nghiệm duyệt Web tuyệt vời nhất.*
