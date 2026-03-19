<?php
/**
 * DataManager: Quản lý dữ liệu JSON
 * Đọc, ghi, cập nhật dữ liệu từ data/data.json
 */

class DataManager
{
    private $dataPath;

    public function __construct()
    {
        $this->dataPath = __DIR__ . '/../data/data.json';
    }

    /**
     * Đọc toàn bộ dữ liệu
     */
    public function loadData()
    {
        if (!file_exists($this->dataPath)) {
            return $this->getDefaultData();
        }

        $json = file_get_contents($this->dataPath);
        $data = json_decode($json, true);
        
        if ($data === null) {
            return $this->getDefaultData();
        }

        return $data;
    }

    /**
     * Lưu dữ liệu
     */
    public function saveData($data)
    {
        $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        $result = file_put_contents($this->dataPath, $json);
        
        if ($result === false) {
            throw new Exception('Không thể lưu dữ liệu');
        }

        return true;
    }

    /**
     * Lấy dữ liệu mặc định
     */
    private function getDefaultData()
    {
        return [
            'skills' => [
                ['id' => 1, 'name' => 'Laravel Refactoring', 'category' => 'Logic', 'duration' => 45],
                ['id' => 2, 'name' => 'English Listening A2', 'category' => 'Language', 'duration' => 25],
                ['id' => 3, 'name' => 'Boxing Training', 'category' => 'Physical', 'duration' => 15]
            ],
            'rewards' => [
                ['id' => 1, 'name' => '15m Jazz music'],
                ['id' => 2, 'name' => 'A cup of milk coffee']
            ],
            'history' => [],
            'settings' => [
                'dailyGoal' => 4,
                'currentInterface' => 'minimalist',
                'streak' => 0,
                'lastFinishedDate' => ''
            ]
        ];
    }

    /**
     * Lấy skills
     */
    public function getSkills()
    {
        $data = $this->loadData();
        return $data['skills'] ?? [];
    }

    /**
     * Thêm skill
     */
    public function addSkill($name, $category, $duration)
    {
        $data = $this->loadData();
        
        // Generate next ID safely
        $id = 1;
        if (isset($data['skills']) && count($data['skills']) > 0) {
            $ids = array_column($data['skills'], 'id');
            $id = max($ids) + 1;
        }
        
        // Initialize skills array if not exists
        if (!isset($data['skills'])) {
            $data['skills'] = [];
        }
        
        $data['skills'][] = [
            'id' => $id,
            'name' => $name,
            'category' => $category,
            'duration' => (int)$duration
        ];
        
        $this->saveData($data);
        return ['id' => $id, 'name' => $name, 'category' => $category, 'duration' => (int)$duration];
    }

    /**
     * Xóa skill
     */
    public function deleteSkill($id)
    {
        $data = $this->loadData();
        $data['skills'] = array_values(array_filter($data['skills'], function($skill) use ($id) {
            return $skill['id'] != $id;
        }));
        
        $this->saveData($data);
        return true;
    }

    /**
     * Lấy rewards
     */
    public function getRewards()
    {
        $data = $this->loadData();
        return $data['rewards'] ?? [];
    }

    /**
     * Thêm reward
     */
    public function addReward($name)
    {
        $data = $this->loadData();
        
        // Generate next ID safely
        $id = 1;
        if (isset($data['rewards']) && count($data['rewards']) > 0) {
            $ids = array_column($data['rewards'], 'id');
            $id = max($ids) + 1;
        }
        
        // Initialize rewards array if not exists
        if (!isset($data['rewards'])) {
            $data['rewards'] = [];
        }
        
        $data['rewards'][] = [
            'id' => $id,
            'name' => $name
        ];
        
        $this->saveData($data);
        return ['id' => $id, 'name' => $name];
    }

    /**
     * Xóa reward
     */
    public function deleteReward($id)
    {
        $data = $this->loadData();
        $data['rewards'] = array_values(array_filter($data['rewards'], function($reward) use ($id) {
            return $reward['id'] != $id;
        }));
        
        $this->saveData($data);
        return true;
    }

    /**
     * Lấy history
     */
    public function getHistory()
    {
        $data = $this->loadData();
        return $data['history'] ?? [];
    }

    /**
     * Thêm vào history
     */
    public function addHistory($skillName, $duration, $category)
    {
        $data = $this->loadData();
        
        $data['history'][] = [
            'id' => time(),
            'name' => $skillName,
            'duration' => (int)$duration,
            'category' => $category,
            'time' => date('H:i'),
            'date' => date('n/j/Y')
        ];
        
        $this->saveData($data);
        return true;
    }

    /**
     * Xóa history
     */
    public function clearHistory()
    {
        $data = $this->loadData();
        $data['history'] = [];
        $this->saveData($data);
        return true;
    }

    /**
     * Lấy settings
     */
    public function getSettings()
    {
        $data = $this->loadData();
        return $data['settings'] ?? [];
    }

    /**
     * Cập nhật settings
     */
    public function updateSettings($settings)
    {
        $data = $this->loadData();
        $data['settings'] = array_merge($data['settings'] ?? [], $settings);
        $this->saveData($data);
        return $data['settings'];
    }

    /**
     * Lấy toàn bộ dữ liệu (dùng cho API)
     */
    public function getAllData()
    {
        return $this->loadData();
    }

    /**
     * Cập nhật toàn bộ dữ liệu từ import
     */
    public function importData($data)
    {
        $this->saveData($data);
        return true;
    }
}
