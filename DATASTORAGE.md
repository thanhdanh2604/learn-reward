# Learn-Reward: Hướng Dẫn Lưu Trữ Dữ Liệu

## 📊 Cách Thức Hoạt Động Mới

Dữ liệu của bạn **không còn được lưu trữ trong localStorage** (bộ nhớ tạm thời). Thay vào đó, ứng dụng sử dụng **IndexedDB** - một cơ sở dữ liệu trong trình duyệt với dung lượng lớn hơn và lâu dài hơn.

### Lợi Ích

✅ **Lưu trữ lâu dài**: Dữ liệu không bị mất ngay cả sau khi đóng trình duyệt
✅ **Dung lượng lớn**: Có thể lưu hàng GB (so với ~5MB của localStorage)
✅ **Hiệu suất tốt hơn**: Không cần parse JSON mỗi lần load
✅ **Backup & Restore**: Export/Import dữ liệu dễ dàng

---

## 🔧 Các Tính Năng Chi Tiết

### 1. **Tự Động Lưu Trữ**
- Khi bạn thêm skill, reward, hoặc hoàn thành một phiên, dữ liệu tự động lưu vào IndexedDB
- Không cần nhấn nút "Save" hay làm gì đặc biệt

### 2. **Export Dữ Liệu (Tải Xuống Backup)**
Để lưu một bản sao dữ liệu trên máy tính:

1. Vào tab **Settings** (⚙️)
2. Kéo xuống phần **"Data Backup & Restore"**
3. Nhấn nút **"📥 Export Dữ Liệu (JSON)"**
4. File `learn-reward-backup-YYYY-MM-DD.json` sẽ được tải xuống

💾 **File này chứa tất cả**: skills, rewards, history, streak, daily goal...

### 3. **Import Dữ Liệu (Khôi Phục từ Backup)**
Để khôi phục dữ liệu từ file backup:

1. Vào tab **Settings** (⚙️)
2. Kéo xuống phần **"Data Backup & Restore"**
3. Nhấn nút **"📤 Import Dữ Liệu (JSON)"**
4. Chọn file `.json` từ máy tính của bạn
5. Ứng dụng sẽ tải lại với dữ liệu mới

⚠️ **Lưu ý**: Import sẽ **ghi đè tất cả dữ liệu hiện tại**. Hãy export trước nếu bạn muốn giữ dữ liệu cũ.

### 4. **Clear Lịch Sử**
- Nhấn **"🗑️ Clear Lịch Sử"** để xóa tất cả các phiên học tập
- Dữ liệu skills, rewards, streak vẫn được giữ lại

---

## 🔍 Cấu Trúc Dữ Liệu JSON

Khi export, file JSON sẽ có cấu trúc như sau:

```json
{
  "skills": [
    { "id": 1, "name": "Laravel Refactoring", "category": "Logic", "duration": 45 },
    { "id": 2, "name": "English Listening A2", "category": "Language", "duration": 25 }
  ],
  "rewards": [
    { "id": 1, "name": "15m Jazz music" },
    { "id": 2, "name": "A cup of milk coffee" }
  ],
  "history": [
    { "name": "Laravel Refactoring", "time": "14:30", "date": "3/18/2026", "duration": 45, "msg": "Giỏi lắm!..." }
  ],
  "dailyGoal": 4,
  "streak": 5,
  "lastFinishedDate": "3/18/2026"
}
```

---

## 🛠️ Tờ Kỹ Thuật

### File Liên Quan
- **`js/db-manager.js`** - Quản lý IndexedDB
- **`js/script.js`** - Logic ứng dụng (sử dụng db-manager)
- **`index.html`** - UI (có nút Export/Import)

### Cách Hoạt Động Kỹ Thuật
1. **Khởi động**: `initializeApp()` tải dữ liệu từ IndexedDB
2. **Thay đổi dữ liệu**: Tự động gọi `await saveData()` → lưu vào IndexedDB
3. **Export**: `exportData()` → tạo JSON blob → download file
4. **Import**: `importData()` → chọn file → parse JSON → lưu vào IndexedDB

### IndexedDB vs localStorage

| Tính năng | localStorage | IndexedDB |
|----------|------------|-----------|
| **Dung lượng** | ~5MB | ~50GB+ |
| **Loại dữ liệu** | String only | Any type (Object, Array, ...) |
| **Async** | Sync (chậm) | Async (nhanh) |
| **Độ bền** | Có thể xóa khi clear cache | Lâu dài hơn |

---

## ❓ FAQ

### Q: Dữ liệu của tôi ở đâu?
**A**: Trong IndexedDB của trình duyệt. Bạn có thể kiểm tra bằng DevTools:
- Mở DevTools (F12)
- Mở tab **Application** → **IndexedDB** → **LearnRewardDB**

### Q: Tôi có thể sử dụng dữ liệu trên máy tính khác không?
**A**: Có! Export file JSON từ máy tính A, rồi import vào máy tính B.

### Q: Nếu tôi xóa cache trình duyệt sẽ sao?
**A**: IndexedDB sẽ bị xóa. Sử dụng Export định kỳ để tránh mất dữ liệu.

### Q: Có cách nào để tự động sync giữa các thiết bị không?
**A**: Hiện tại chưa. Bạn cần export/import thủ công hoặc sử dụng cloud storage.

---

## 📌 Hướng Dẫn Sử Dụng

### Quy Trình Để An Toàn
1. **Hàng tuần**: Vào Settings → Export dữ liệu
2. **Lưu file backup** ở một nơi an toàn (Google Drive, Dropbox, ...)
3. **Nếu cần khôi phục**: Import file JSON cũ

### Sao Lưu Tự Động
Không có tính năng tự động backup hiện tại, nhưng bạn có thể:
- Tạo một script tự động download backup hàng ngày
- Sử dụng service worker để tự động sync dữ liệu

---

**Lần cập nhật cuối**: March 18, 2026
**Phiên bản**: 2.0 (IndexedDB)
