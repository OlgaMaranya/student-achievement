<?php
// Тестовый скрипт для проверки PHP API с PostgreSQL
require_once 'php-api/config/database.php';

echo "Тестирование подключения к базе данных ИрГУПС...\n";

try {
    $db = Database::getInstance();
    echo "✓ Подключение к PostgreSQL успешно!\n";
    
    // Тест получения пользователей
    $users = $db->fetchAll("SELECT * FROM \"Users\" LIMIT 3");
    echo "✓ Найдено пользователей: " . count($users) . "\n";
    
    foreach ($users as $user) {
        echo "  - {$user['FirstName']} {$user['LastName']} ({$user['Email']})\n";
    }
    
    // Тест получения достижений
    $achievements = $db->fetchAll("SELECT * FROM \"Achievements\" LIMIT 5");
    echo "✓ Найдено достижений: " . count($achievements) . "\n";
    
    foreach ($achievements as $achievement) {
        echo "  - {$achievement['Title']} ({$achievement['Points']} баллов)\n";
    }
    
    // Тест получения достижений пользователей
    $userAchievements = $db->fetchAll("
        SELECT ua.*, a.Title, a.Points, u.FirstName, u.LastName 
        FROM \"UserAchievements\" ua
        JOIN \"Achievements\" a ON ua.\"FK_achievement_id\" = a.\"ID_achievement\"
        JOIN \"Users\" u ON ua.\"FK_user_id\" = u.\"UserID\"
        LIMIT 5
    ");
    echo "✓ Найдено достижений пользователей: " . count($userAchievements) . "\n";
    
    foreach ($userAchievements as $ua) {
        echo "  - {$ua['FirstName']} {$ua['LastName']}: {$ua['Title']} ({$ua['Points']} баллов)\n";
    }
    
    echo "\n✅ Все тесты прошли успешно! База данных ИрГУПС готова к работе.\n";
    
} catch (Exception $e) {
    echo "❌ Ошибка: " . $e->getMessage() . "\n";
}
?>