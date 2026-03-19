<?php
/**
 * API: Lấy toàn bộ dữ liệu
 */
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../includes/DataManager.php';

try {
    $manager = new DataManager();
    $data = $manager->getAllData();
    
    echo json_encode([
        'success' => true,
        'data' => $data
    ], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
