# Mini Browser Extension 🌐 `v1.0.5`

Mini Browser là một tiện ích mở rộng mạnh mẽ cho Google Chrome, mang đến trải nghiệm trình duyệt thu nhỏ ngay gọn gàng bên cạnh tab làm việc chính của bạn.

Được phát triển và thiết kế bởi **Black Candy 🍫**.

---

## ✨ Tính Năng Nổi Bật

- **Duyệt web Song Song (Split View):** 
   - Hỗ trợ chia màn hình theo chiều **Dọc (V-Split)** và **Ngang (H-Split)**.
   - **Thanh kéo Resizer:** Tự do thay đổi tỉ lệ hiển thị giữa 2 khung hình bằng chuột siêu mượt.
   - **Hoán đổi (Swap 🔄):** Đổi chỗ nội dung giữa 2 khung hình chỉ với 1 click.
   - **Mục tiêu nạp URL (Target Selector):** Nút chọn thông minh giúp bạn xác định URL sẽ được nạp vào khung hình nào (Trên/Dưới hoặc Trái/Phải).
- **Giao diện Đa sắc thái (Dark/Light Mode) 🌙☀️:**
   - Hỗ trợ chế độ Sáng và Tối cao cấp, bảo vệ mắt khi làm việc ban đêm.
   - Chế độ **Tự động (Auto)**: Tự động đồng bộ theo giao diện của hệ điều hành Windows/MacOS.
   - Hiệu ứng chuyển cảnh (Transition) và Hover cao cấp, mang lại trải nghiệm Premium.
- **Tường lửa Iframe Bypass:** Trang bị engine tuỳ chỉnh loại bỏ các chứng chỉ chặn nhúng `X-Frame-Options`, `Content-Security-Policy` & `Sec-Fetch-*`. Chạy mượt mà từ ChatGPT, Gemini đến các trang web ngân hàng, hệ thống Email bảo mật cao (Gmail, Outlook).
- **Thiết kế Glassmorphism & Modern UI:** Sử dụng hệ thống biến CSS (CSS Variables) linh hoạt, giao diện Apple Style trong suốt, đổ bóng mịn màng.
- **Lịch Sử & Ghim URL URL Yêu Thích:** 
   - Tự động lưu mọi URL bạn từng nhập.
   - Ghim (Pin ★) URL lên cực kỳ nhanh để tiện truy cập sau này.
   - Trích xuất biểu tượng Icon (Favicon) tự động cho từng link.
- **Công cụ nhập liệu thần tốc:** Sao chép/Paste trong 1 chạm (📋) và Xóa rỗng input linh hoạt (✕).
- **Dropdown List Tích Hợp Điều Khiển:** Menu "Mini Browser ▼" không chỉ chứa danh sách ghim mà còn tích hợp sẵn bộ điều khiển Split View và Swap để Toolbar luôn gọn gàng.

## 🚀 Hướng Dẫn Cài Đặt (Dành cho Developer)

1. Tải về hoặc Clone toàn bộ thư mục mã nguồn này.
2. Mở trình duyệt Google Chrome (hoặc Edge, Cốc Cốc, Brave).
3. Truy cập vào phần quản lý Tiện ích mở rộng tại: `chrome://extensions/`
4. Ở góc trên cùng bên phải, bật công tắc **Chế độ dành cho nhà phát triển (Developer mode)**.
5. Nhấn nút **Tải tiện ích đã giải nén (Load unpacked)** ở góc trên bên trái.
6. Duyệt đến thư mục chứa mã nguồn của Mini Browser và chọn nó.
7. Bạn đã cài đặt thành công! Ghim 📌 (Pin) tiện ích lên thanh trình duyệt và sử dụng nhé.

## 📖 Hướng Dẫn Sử Dụng

1. **Giao Diện Duyệt Web (Home)**: Mở tiện ích trên thanh Side Panel để duyệt web song song. 
   - Bấm vào chữ **"Mini Browser ▼"** trên cùng để mở bộ điều khiển **Split View (Dọc/Ngang)**, **Hoán đổi (Swap)** và danh sách ghim.
   - Khi ở chế độ Split, dùng nút **Target (🔼/🔽 hoặc ◀️/▶️)** trên Toolbar để chọn khung hình muốn nạp URL.
2. **Cài Đặt (Settings)**: Bấm nút "⚙️ Settings" ở góc trên cùng bên phải.
   - **Giao diện (Theme):** Bấm nút toggle để chuyển đổi nhanh giữa Sáng ☀️ và Tối 🌙.
   - **Thanh kéo Resizer:** Di chuột vào vạch kẻ giữa 2 khung hình (khi đang Split) và kéo để thay đổi kích thước.
3. **Nhập URL Nhanh**: 
      - Dùng nút "📋" để dán ngay link bạn vừa copy (Clipboard).
      - Dùng nút "✕" để xóa sạch ô nhập chữ nhanh chóng.
      - Sau khi có link, hãy bấm **"Lưu & Mở"**. Hệ thống sẽ tự thêm `https://` nếu bạn lỡ quên gõ nha.
4. **Quản Lý Lịch Sử URL**: Mọi trang bạn nhập đều được lưu lại ngay phía dưới cho lần truy cập sau.
      - Bấm biểu tượng **Ngôi sao (☆ / ★)** để Ghim trang web yêu thích.
      - Di chuột vào một URL bất kỳ sẽ hiện nút **Thùng rác (🗑️)** để xoá từng mục một.
      - Dùng nút **"Xóa tất cả"** khi muốn làm sạch toàn bộ lịch sử danh sách.
      - Các trang web ở danh sách này đều tự hiển thị Icon riêng biệt lấy từ nguồn của Google cực đẹp.

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
