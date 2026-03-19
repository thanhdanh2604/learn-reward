<?php
/**
 * API: Xóa skill
 */
header('Content-Type: application/json; charset=utf-8');

error_log("deleteSkill.php called");

require_once __DIR__ . '/../includes/DataManager.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['id'])) {
        throw new Exception('Thiếu thông tin bắt buộc: id');
    }
    
    $manager = new DataManager();
    $manager->deleteSkill($input['id']);
    
    echo json_encode([
        'success' => true,
        'message' => 'Xóa skill thành công'
    ], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    error_log("deleteSkill.php error: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
?>