<?php
/**
 * API: Cập nhật settings (dailyGoal, currentInterface)
 */
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../includes/DataManager.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Dữ liệu không hợp lệ');
    }
    
    $manager = new DataManager();
    $settings = $manager->updateSettings($input);
    
    echo json_encode([
        'success' => true,
        'data' => $settings
    ], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
