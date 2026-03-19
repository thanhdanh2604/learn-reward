<?php
/**
 * API: Hoàn thành một phiên học tập (thêm vào history, cập nhật streak)
 */
header('Content-Type: application/json; charset=utf-8');

error_log("finishSession.php called");

require_once __DIR__ . '/../includes/DataManager.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['skillName']) || !isset($input['duration']) || !isset($input['category'])) {
        throw new Exception('Thiếu thông tin bắt buộc: skillName, duration, category');
    }
    
    $manager = new DataManager();
    $settings = $manager->getSettings();
    
    // Cập nhật streak
    $today = date('n/j/Y');
    $yesterday = date('n/j/Y', strtotime('-1 day'));
    
    if ($settings['lastFinishedDate'] !== $today) {
        if ($settings['lastFinishedDate'] === $yesterday) {
            $settings['streak']++;
        } else {
            $settings['streak'] = 1;
        }
        $settings['lastFinishedDate'] = $today;
    }
    
    $manager->updateSettings($settings);
    $manager->addHistory($input['skillName'], $input['duration'], $input['category']);
    
    echo json_encode([
        'success' => true,
        'streak' => $settings['streak'],
        'message' => 'Lưu phiên học tập thành công'
    ], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    error_log("finishSession.php error: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
?>