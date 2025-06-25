<?php
require_once __DIR__ . '/../config/database.php';

class KPI {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    public function getUserKPI($userId) {
        return $this->db->fetchOne(
            "SELECT * FROM KPI WHERE FK_user_id = ? ORDER BY Valid_from DESC LIMIT 1",
            [$userId]
        );
    }
    
    public function create($userId, $kpiData) {
        $this->db->execute(
            "INSERT INTO KPI (FK_user_id, Total_points, Semester_rating, Academic_rating, 
                             Scientific_rating, Cultural_rating, Sports_rating, Social_rating, 
                             Valid_from, Valid_to) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $userId,
                $kpiData['Total_points'],
                $kpiData['Semester_rating'],
                $kpiData['Academic_rating'],
                $kpiData['Scientific_rating'],
                $kpiData['Cultural_rating'],
                $kpiData['Sports_rating'],
                $kpiData['Social_rating'],
                $kpiData['Valid_from'],
                $kpiData['Valid_to'] ?? null
            ]
        );
        
        return $this->getUserKPI($userId);
    }
    
    public function calculateTotalPoints($userId) {
        // Рассчитать общий рейтинг на основе достижений пользователя
        $result = $this->db->fetchOne(
            "SELECT SUM(a.Points) as total_points
             FROM UserAchievements ua
             JOIN Achievements a ON ua.FK_achievement_id = a.ID_achievement
             WHERE ua.FK_user_id = ?",
            [$userId]
        );
        
        return $result['total_points'] ?? 0;
    }
    
    public function calculateCategoryRatings($userId) {
        // Рассчитать рейтинги по категориям
        return $this->db->fetchAll(
            "SELECT a.Category, SUM(a.Points) as category_points
             FROM UserAchievements ua
             JOIN Achievements a ON ua.FK_achievement_id = a.ID_achievement
             WHERE ua.FK_user_id = ?
             GROUP BY a.Category",
            [$userId]
        );
    }
}
?>