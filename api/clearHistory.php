<?php
/**
 * API: Xóa history
 */
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../includes/DataManager.php';

try {
    $manager = new DataManager();
    $manager->clearHistory();
    
    echo json_encode([
        'success' => true,
        'message' => 'Xóa lịch sử thành công'
    ], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
