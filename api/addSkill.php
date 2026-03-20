<?php
/**
 * API: Thêm skill
 */
header('Content-Type: application/json; charset=utf-8');

error_log("=== addSkill.php called ===");

require_once __DIR__ . '/../includes/DataManager.php';

try {
    // Get raw input
    $rawInput = file_get_contents('php://input');
    error_log("Raw input: " . $rawInput);
    
    $input = json_decode($rawInput, true);
    error_log("Parsed input: " . json_encode($input));
    
    if (!$input || !isset($input['name']) || !isset($input['category']) || !isset($input['duration'])) {
        error_log("Missing fields - input: " . print_r($input, true));
        throw new Exception('Thiếu thông tin bắt buộc: name, category, duration');
    }
    
    $manager = new DataManager();
    $skill = $manager->addSkill($input['name'], $input['category'], $input['duration']);
    
    echo json_encode([
        'success' => true,
        'data' => $skill
    ], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    error_log("addSkill.php error: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
?>
