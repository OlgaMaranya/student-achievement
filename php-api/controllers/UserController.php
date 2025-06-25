<?php
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/UserAchievement.php';

class UserController {
    private $userModel;
    private $userAchievementModel;
    
    public function __construct() {
        $this->userModel = new User();
        $this->userAchievementModel = new UserAchievement();
    }
    
    public function getUser($id) {
        try {
            $user = $this->userModel->getById($id);
            if (!$user) {
                http_response_code(404);
                echo json_encode(['error' => 'Пользователь не найден']);
                return;
            }
            echo json_encode($user);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Ошибка получения данных пользователя: ' . $e->getMessage()]);
        }
    }
    
    public function updateUser($id) {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            $updatedUser = $this->userModel->update($id, $input);
            echo json_encode($updatedUser);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Ошибка обновления профиля: ' . $e->getMessage()]);
        }
    }
    
    public function getUserAchievements($userId) {
        try {
            $achievements = $this->userAchievementModel->getUserAchievements($userId);
            echo json_encode($achievements);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Ошибка получения достижений: ' . $e->getMessage()]);
        }
    }
    
    public function createUserAchievement($userId) {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            $achievementData = [
                'FK_user_id' => $userId,
                'FK_achievement_id' => $input['achievementId'],
                'Date_received' => $input['dateReceived'],
                'Document_confirmation' => $input['document'] ?? null
            ];
            
            $achievement = $this->userAchievementModel->create($achievementData);
            http_response_code(201);
            echo json_encode($achievement);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Ошибка создания достижения: ' . $e->getMessage()]);
        }
    }
    
    public function getUserCourses($userId) {
        try {
            $courses = $this->userModel->getUserCourses($userId);
            echo json_encode($courses);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Ошибка получения курсов пользователя: ' . $e->getMessage()]);
        }
    }
    
    public function getAssessmentData($userId) {
        try {
            $assessments = $this->userModel->getAssessmentData($userId);
            echo json_encode($assessments);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Ошибка получения данных оценки: ' . $e->getMessage()]);
        }
    }
    
    public function getDiagnosticData($userId) {
        try {
            $diagnostics = $this->userModel->getDiagnosticData($userId);
            echo json_encode($diagnostics);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Ошибка получения диагностических данных: ' . $e->getMessage()]);
        }
    }
    
    public function getUserProjects($userId) {
        try {
            $projects = $this->userModel->getUserProjects($userId);
            echo json_encode($projects);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Ошибка получения проектов пользователя: ' . $e->getMessage()]);
        }
    }
    
    public function getParticipationData($userId) {
        try {
            $participation = $this->userModel->getParticipationData($userId);
            echo json_encode($participation);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Ошибка получения данных участия: ' . $e->getMessage()]);
        }
    }
    
    public function getCourses() {
        try {
            $courses = $this->userModel->getAllCourses();
            echo json_encode($courses);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Ошибка получения курсов: ' . $e->getMessage()]);
        }
    }
    
    public function getCompetencies() {
        try {
            $competencies = $this->userModel->getAllCompetencies();
            echo json_encode($competencies);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Ошибка получения компетенций: ' . $e->getMessage()]);
        }
    }
    
    public function getProjects() {
        try {
            $projects = $this->userModel->getAllProjects();
            echo json_encode($projects);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Ошибка получения проектов: ' . $e->getMessage()]);
        }
    }
}
?>