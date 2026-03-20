<?php
/**
 * API: Thêm reward
 */
header('Content-Type: application/json; charset=utf-8');

error_log("addReward.php called");

require_once __DIR__ . '/../includes/DataManager.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['name'])) {
        throw new Exception('Thiếu thông tin bắt buộc: name');
    }
    
    $manager = new DataManager();
    $reward = $manager->addReward($input['name']);
    
    echo json_encode([
        'success' => true,
        'data' => $reward
    ], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    error_log("addReward.php error: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
?>
