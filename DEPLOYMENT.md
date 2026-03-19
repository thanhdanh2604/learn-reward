# Learn-Reward Deployment Guide

## Production Server Setup

Nếu gặp lỗi **500 Internal Server Error** khi thêm skill/reward trên production server, hãy thực hiện các bước sau:

### 1. **Fix File Permissions**

Web server (Apache/Nginx) cần quyền ghi vào thư mục `data/` để lưu dữ liệu vào `data.json`.

```bash
cd /path/to/learn-reward

# Cho phép thư mục data/ có quyền ghi
chmod 777 data/

# Cho phép file data.json có quyền ghi cho tất cả
chmod 666 data/data.json

# Hoặc nếu muốn cụ thể hơn, chỉ cho web server user:
sudo chown www-data:www-data data/
sudo chmod 775 data/
sudo chmod 664 data/data.json
```

### 2. **Kiểm tra PHP Configuration**

Đảm bảo các cấu hình này trong `php.ini`:

```ini
# Cho phép đủ thời gian xử lý request
max_execution_time = 30

# Upload size đủ lớn nếu cần
upload_max_filesize = 10M
post_max_size = 10M

# Display errors (chỉ cho development)
display_errors = 1
error_reporting = E_ALL
```

### 3. **Check Apache/Nginx Logs**

Xem chi tiết lỗi từ server logs:

**Apache:**
```bash
tail -f /var/log/apache2/error.log
```

**Nginx:**
```bash
tail -f /var/log/nginx/error.log
```

**PHP Error Log:**
```bash
tail -f /var/log/php-errors.log
```

### 4. **API Endpoints**

Tất cả API endpoints đều trả về JSON format:

- `GET  /api/getData.php` - Lấy tất cả dữ liệu
- `POST /api/addSkill.php` - Thêm skill
- `POST /api/deleteSkill.php` - Xóa skill
- `POST /api/addReward.php` - Thêm reward
- `POST /api/deleteReward.php` - Xóa reward
- `POST /api/finishSession.php` - Hoàn thành phiên học
- `POST /api/clearHistory.php` - Xóa lịch sử
- `POST /api/updateSettings.php` - Cập nhật cài đặt

### 5. **Troubleshooting**

**Lỗi: `Failed to execute 'json' on 'Response': Unexpected end of JSON input`**

Nguyên nhân: API endpoint trả về lỗi HTML thay vì JSON (HTTP 500)

**Giải pháp:**
- Kiểm tra file permissions (xem mục 1)
- Xem PHP error logs
- Đảm bảo `data/data.json` tồn tại và có thể ghi được

**Lỗi: `Không thể lưu dữ liệu`**

Nguyên nhân: File permissions không đủ

**Giải pháp:**
```bash
chmod 777 data/
chmod 666 data/data.json
```

### 6. **Data Backup**

Để backup dữ liệu, tải về `data/data.json`:

```bash
# Hoặc sửng tính năng Export trong app
# Settings → Export Data
```

### 7. **Testing API Locally**

```bash
# Test addSkill
curl -X POST http://localhost/learn-reward/api/addSkill.php \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","category":"Logic","duration":25}'

# Test getData  
curl http://localhost/learn-reward/api/getData.php
```

## Development Notes

- Mọi dữ liệu được lưu trong `data/data.json` - single JSON file
- Các interfaces (minimalist, pixel, retro) chia sẻ cùng một API backend
- Frontend tự động reload dữ liệu qua `app.js`
- Confetti animation yêu cầu CDN: `canvas-confetti`

## File Structure

```
learn-reward/
├── api/                  # API endpoints
│   ├── getData.php
│   ├── addSkill.php
│   ├── deleteSkill.php
│   ├── addReward.php
│   ├── deleteReward.php
│   ├── finishSession.php
│   ├── clearHistory.php
│   └── updateSettings.php
├── includes/
│   └── DataManager.php  # Data handling class
├── assets/
│   ├── js/
│   │   └── app.js       # Frontend logic
│   ├── css/
│   │   └── styles.css
│   └── images/          # Interface images
├── views/
│   ├── minimalist.php   # Clean interface
│   ├── pixel.php        # Mario theme
│   └── retro.php        # Arcade theme
├── data/
│   └── data.json        # Data storage (needs write permission)
├── index.php            # Router
└── DEPLOYMENT.md        # This file
```

---

**Last Updated:** March 19, 2026 | Learn-Reward v1.0
