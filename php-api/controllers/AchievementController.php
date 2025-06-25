<?php
require_once __DIR__ . '/../models/Achievement.php';
require_once __DIR__ . '/../models/UserAchievement.php';

class AchievementController {
    private $achievementModel;
    private $userAchievementModel;
    
    public function __construct() {
        $this->achievementModel = new Achievement();
        $this->userAchievementModel = new UserAchievement();
    }
    
    public function getAllAchievements() {
        try {
            $achievements = $this->achievementModel->getAll();
            echo json_encode($achievements);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Ошибка получения достижений: ' . $e->getMessage()]);
        }
    }
    
    public function getLevels() {
        try {
            $levels = $this->achievementModel->getLevels();
            echo json_encode($levels);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Ошибка получения уровней: ' . $e->getMessage()]);
        }
    }
    
    public function getTypesOfAchievements() {
        try {
            $types = $this->achievementModel->getTypesOfAchievements();
            echo json_encode($types);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Ошибка получения типов достижений: ' . $e->getMessage()]);
        }
    }
    
    public function getActivities() {
        try {
            $activities = $this->achievementModel->getActivities();
            echo json_encode($activities);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Ошибка получения активностей: ' . $e->getMessage()]);
        }
    }
    
    public function deleteUserAchievement($id) {
        try {
            $result = $this->userAchievementModel->delete($id);
            if ($result) {
                echo json_encode(['message' => 'Достижение успешно удалено']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Достижение не найдено']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Ошибка удаления достижения: ' . $e->getMessage()]);
        }
    }
}
?>