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
require_once 'models/User.php';
require_once 'models/Achievement.php';
require_once 'models/UserAchievement.php';
require_once 'models/KPI.php';
require_once 'controllers/UserController.php';
require_once 'controllers/AchievementController.php';
require_once 'controllers/KPIController.php';

// Роутинг
$request_method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/php-api', '', $path);
$path_parts = explode('/', trim($path, '/'));

try {
    switch ($path_parts[0]) {
        case 'users':
            $controller = new UserController();
            if (isset($path_parts[1]) && is_numeric($path_parts[1])) {
                $userId = (int)$path_parts[1];
                if (isset($path_parts[2])) {
                    switch ($path_parts[2]) {
                        case 'achievements':
                            if ($request_method === 'GET') {
                                $controller->getUserAchievements($userId);
                            } elseif ($request_method === 'POST') {
                                $controller->createUserAchievement($userId);
                            }
                            break;
                        case 'kpi':
                            $kpiController = new KPIController();
                            if ($request_method === 'GET') {
                                $kpiController->getUserKPI($userId);
                            } elseif ($request_method === 'PUT') {
                                $kpiController->updateUserKPI($userId);
                            }
                            break;
                        case 'courses':
                            if ($request_method === 'GET') {
                                $controller->getUserCourses($userId);
                            }
                            break;
                        case 'assessments':
                            if ($request_method === 'GET') {
                                $controller->getAssessmentData($userId);
                            }
                            break;
                        case 'diagnostics':
                            if ($request_method === 'GET') {
                                $controller->getDiagnosticData($userId);
                            }
                            break;
                        case 'projects':
                            if ($request_method === 'GET') {
                                $controller->getUserProjects($userId);
                            }
                            break;
                        case 'participation':
                            if ($request_method === 'GET') {
                                $controller->getParticipationData($userId);
                            }
                            break;
                    }
                } else {
                    if ($request_method === 'GET') {
                        $controller->getUser($userId);
                    } elseif ($request_method === 'PUT') {
                        $controller->updateUser($userId);
                    }
                }
            }
            break;
            
        case 'achievements':
            $controller = new AchievementController();
            if ($request_method === 'GET') {
                $controller->getAllAchievements();
            } elseif (isset($path_parts[1]) && is_numeric($path_parts[1])) {
                $achievementId = (int)$path_parts[1];
                if ($request_method === 'DELETE') {
                    $controller->deleteUserAchievement($achievementId);
                }
            }
            break;
            
        case 'levels':
            $controller = new AchievementController();
            if ($request_method === 'GET') {
                $controller->getLevels();
            }
            break;
            
        case 'types':
            $controller = new AchievementController();
            if ($request_method === 'GET') {
                $controller->getTypesOfAchievements();
            }
            break;
            
        case 'activities':
            $controller = new AchievementController();
            if ($request_method === 'GET') {
                $controller->getActivities();
            }
            break;
            
        case 'courses':
            $controller = new UserController();
            if ($request_method === 'GET') {
                $controller->getCourses();
            }
            break;
            
        case 'competencies':
            $controller = new UserController();
            if ($request_method === 'GET') {
                $controller->getCompetencies();
            }
            break;
            
        case 'projects':
            $controller = new UserController();
            if ($request_method === 'GET') {
                $controller->getProjects();
            }
            break;
            
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Endpoint не найден']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Внутренняя ошибка сервера: ' . $e->getMessage()]);
}
?>