<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config/database.php';

try {
    $db = Database::getInstance();
    
    // Получение всех пользователей
    $users = $db->fetchAll('SELECT * FROM Users');
    
    echo json_encode([
        'status' => 'success',
        'message' => 'PHP API работает корректно',
        'data' => [
            'users' => $users,
            'server_time' => date('Y-m-d H:i:s'),
            'database' => 'PostgreSQL'
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>