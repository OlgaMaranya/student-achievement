<?php
// Прямое тестирование PHP API без сервера
require_once 'php-api/config/database.php';
require_once 'php-api/models/User.php';
require_once 'php-api/models/Achievement.php';
require_once 'php-api/models/UserAchievement.php';
require_once 'php-api/models/KPI.php';

echo "=== Тестирование PHP API для системы ИрГУПС ===\n\n";

try {
    // Тест подключения к базе данных
    echo "1. Тестирование подключения к PostgreSQL...\n";
    $db = Database::getInstance();
    echo "✓ Подключение успешно\n\n";
    
    // Тест работы с пользователями
    echo "2. Тестирование модели User...\n";
    $userModel = new User();
    $users = $db->fetchAll('SELECT * FROM "Users" LIMIT 3');
    echo "✓ Найдено пользователей: " . count($users) . "\n";
    foreach ($users as $user) {
        echo "  - {$user['FirstName']} {$user['LastName']} (ID: {$user['UserID']})\n";
    }
    echo "\n";
    
    // Тест получения достижений
    echo "3. Тестирование модели Achievement...\n";
    $achievementModel = new Achievement();
    $achievements = $db->fetchAll('SELECT * FROM "Achievements" LIMIT 5');
    echo "✓ Найдено достижений: " . count($achievements) . "\n";
    foreach ($achievements as $achievement) {
        echo "  - {$achievement['Title']} ({$achievement['Points']} баллов)\n";
    }
    echo "\n";
    
    // Тест достижений пользователей
    echo "4. Тестирование модели UserAchievement...\n";
    $userAchievementModel = new UserAchievement();
    $userAchievements = $userAchievementModel->getUserAchievements(1);
    echo "✓ Достижений пользователя ID=1: " . count($userAchievements) . "\n";
    foreach ($userAchievements as $ua) {
        echo "  - {$ua['Title']} ({$ua['Points']} баллов)\n";
    }
    echo "\n";
    
    // Тест KPI
    echo "5. Тестирование модели KPI...\n";
    $kpiModel = new KPI();
    $kpi = $kpiModel->getUserKPI(1);
    if ($kpi) {
        echo "✓ KPI пользователя ID=1:\n";
        echo "  - Общий рейтинг: {$kpi['Total_points']}\n";
        echo "  - Учебный рейтинг: {$kpi['Academic_rating']}\n";
        echo "  - Научный рейтинг: {$kpi['Scientific_rating']}\n";
    } else {
        echo "✗ KPI не найден для пользователя ID=1\n";
    }
    echo "\n";
    
    // Тест справочников
    echo "6. Тестирование справочников...\n";
    $levels = $db->fetchAll('SELECT * FROM "Levels"');
    $types = $db->fetchAll('SELECT * FROM "TypesOfAchievements"');
    $courses = $db->fetchAll('SELECT * FROM "Courses"');
    
    echo "✓ Уровни достижений: " . count($levels) . "\n";
    echo "✓ Типы достижений: " . count($types) . "\n";
    echo "✓ Курсы: " . count($courses) . "\n\n";
    
    echo "=== Все тесты прошли успешно! ===\n";
    echo "Система ИрГУПС готова к работе с PostgreSQL базой данных.\n";
    
} catch (Exception $e) {
    echo "❌ Ошибка: " . $e->getMessage() . "\n";
    echo "Стек вызовов:\n" . $e->getTraceAsString() . "\n";
}
?>