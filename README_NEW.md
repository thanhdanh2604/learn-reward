# Learn-Reward App - New PHP Architecture

## 📁 Folder Structure

```
learn-reward/
├── index.php                 # Main entry point (router)
├── api/                      # API endpoints (PHP)
│   ├── getData.php          # GET all data
│   ├── addSkill.php         # POST add skill
│   ├── deleteSkill.php      # POST delete skill
│   ├── addReward.php        # POST add reward
│   ├── deleteReward.php     # POST delete reward
│   ├── finishSession.php    # POST complete session (auto streak update)
│   ├── clearHistory.php     # POST clear history
│   └── updateSettings.php   # POST update settings
├── includes/                # PHP utilities
│   └── DataManager.php      # JSON data management class
├── assets/                  # Frontend resources
│   ├── js/
│   │   ├── app.js          # Main frontend logic (fetch-based)
│   │   └── config.js       # (optional) API configuration
│   ├── css/
│   │   └── styles.css      # Tailwind + custom styles
│   └── images/
│       └── sky-retro.jpg   # Static images
├── views/                   # User interface templates
│   ├── minimalist.php      # Clean, modern UI
│   ├── pixel.php           # 8-bit / pixel art style
│   └── retro.php           # Green terminal / CRT style
├── data/                    # Persistent storage
│   └── data.json           # All app data (JSON format)
└── logs/                    # (optional) Activity logs

```

## 🎯 How It Works

### **Data Flow**

1. **Frontend (app.js)** sends requests to API endpoints via `fetch()`
2. **API endpoints** load/modify `data/data.json` via `DataManager` class
3. **DataManager** handles read/write operations safely
4. **Changes persist** immediately to the JSON file

### **Data Structure** (data.json)

```json
{
  "skills": [
    {"id": 1, "name": "Laravel Refactoring", "category": "Logic", "duration": 45},
    ...
  ],
  "rewards": [
    {"id": 1, "name": "15m Jazz music"},
    ...
  ],
  "history": [
    {
      "id": 1710850200,
      "name": "Laravel Refactoring",
      "duration": 45,
      "category": "Logic",
      "time": "14:30",
      "date": "3/19/2025"
    }
  ],
  "settings": {
    "dailyGoal": 4,
    "currentInterface": "minimalist",
    "streak": 0,
    "lastFinishedDate": "3/19/2025"
  }
}
```

## 🚀 API Endpoints

### GET Data
```bash
GET /api/getData.php
# Returns: { success: true, data: { skills, rewards, history, settings } }
```

### Add Skill
```bash
POST /api/addSkill.php
# Body: { name, category, duration }
# Returns: { success: true, data: { id, name, category, duration } }
```

### Delete Skill
```bash
POST /api/deleteSkill.php
# Body: { id }
# Returns: { success: true, message: "Xóa skill thành công" }
```

### Add Reward
```bash
POST /api/addReward.php
# Body: { name }
# Returns: { success: true, data: { id, name } }
```

### Delete Reward
```bash
POST /api/deleteReward.php
# Body: { id }
# Returns: { success: true, message: "Xóa reward thành công" }
```

### Finish Session
```bash
POST /api/finishSession.php
# Body: { skillName, duration, category }
# Returns: { success: true, streak: 5, message: "Lưu phiên học tập thành công" }
# Note: Automatically updates streak based on date
```

### Clear History
```bash
POST /api/clearHistory.php
# Returns: { success: true, message: "Xóa lịch sử thành công" }
```

### Update Settings
```bash
POST /api/updateSettings.php
# Body: { dailyGoal, currentInterface, ... }
# Returns: { success: true, data: { updated settings } }
```

## 🎨 Interfaces

### Minimalist (Default)
- Clean, modern design
- Tailwind CSS
- Best for focus
- Access: `http://localhost:8090/learn-reward/`

### Pixel Art
- 8-bit retro style
- Bright cyan borders
- Fun & nostalgic
- Access: `http://localhost:8090/learn-reward/?view=pixel` (or change in settings)

### Retro/CRT
- Terminal-like green screen
- "Hacker" aesthetic
- Monospace fonts
- Access: `http://localhost:8090/learn-reward/?view=retro` (or change in settings)

## 🔧 Development Notes

### **No IndexedDB** ✅
- Data stored in **JSON file** instead
- See `data/data.json`
- Survives browser cache clear
- Easy to backup/restore

### **Frontend Architecture**
- All logic in `assets/js/app.js`
- No framework (vanilla JS + fetch API)
- Communicates with PHP backend
- Real-time updates

### **PHP Backend**
- Simple, stateless API
- `DataManager` handles all I/O
- Error handling included
- JSON responses

### **Adding New Features**
1. Create new API endpoint in `api/`
2. Add fetch call in `assets/js/app.js`
3. Update UI in relevant `views/*.php` file

### **Modifying Data**
- Edit `data/data.json` directly (for testing)
- Always goes through `DataManager` class
- Automatic date/time stamps on history
- ID generation uses timestamps

## ⚠️ Important

- **Permissions**: Ensure `data/data.json` is writable by PHP (755)
- **Backup**: Export data regularly via Settings → Export
- **Import**: Upload backup JSON via Settings → Import (not yet auto-implemented, contact admin)

## 🔄 Migration from Old Version

Old IndexedDB data is **NOT automatically migrated**. To keep your data:
1. Open old version (`index-old.html`)
2. Go to Settings
3. Click "Export Data"
4. Save the JSON file
5. Open new version here (`index.php`)
6. Go to Settings
7. Click "Import Data"
8. Upload the saved JSON

---

**Last Updated**: March 19, 2025
**Version**: 2.0 (PHP + JSON)
