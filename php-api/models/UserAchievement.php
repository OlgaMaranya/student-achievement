<?php
require_once __DIR__ . '/../config/database.php';

class UserAchievement {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    public function getUserAchievements($userId) {
        return $this->db->fetchAll(
            "SELECT ua.*, a.Title, a.Category, a.Points, l.Name as LevelName, t.Name as TypeName 
             FROM UserAchievements ua
             JOIN Achievements a ON ua.FK_achievement_id = a.ID_achievement
             JOIN Levels l ON a.Level_id = l.ID_level
             JOIN TypesOfAchievements t ON a.Type_id = t.ID_type
             WHERE ua.FK_user_id = ? 
             ORDER BY ua.Date_received DESC",
            [$userId]
        );
    }
    
    public function create($userAchievementData) {
        $this->db->execute(
            "INSERT INTO UserAchievements (FK_user_id, FK_achievement_id, Date_received, Document_confirmation) VALUES (?, ?, ?, ?)",
            [
                $userAchievementData['FK_user_id'],
                $userAchievementData['FK_achievement_id'],
                $userAchievementData['Date_received'],
                $userAchievementData['Document_confirmation']
            ]
        );
        
        return $this->db->fetchOne(
            "SELECT * FROM UserAchievements WHERE ID_user_achievement = ?",
            [$this->db->lastInsertId()]
        );
    }
    
    public function update($id, $userAchievementData) {
        $fields = [];
        $values = [];
        
        if (isset($userAchievementData['FK_achievement_id'])) {
            $fields[] = 'FK_achievement_id = ?';
            $values[] = $userAchievementData['FK_achievement_id'];
        }
        if (isset($userAchievementData['Date_received'])) {
            $fields[] = 'Date_received = ?';
            $values[] = $userAchievementData['Date_received'];
        }
        if (isset($userAchievementData['Document_confirmation'])) {
            $fields[] = 'Document_confirmation = ?';
            $values[] = $userAchievementData['Document_confirmation'];
        }
        
        if (empty($fields)) {
            return $this->db->fetchOne(
                "SELECT * FROM UserAchievements WHERE ID_user_achievement = ?",
                [$id]
            );
        }
        
        $values[] = $id;
        $sql = "UPDATE UserAchievements SET " . implode(', ', $fields) . " WHERE ID_user_achievement = ?";
        $this->db->execute($sql, $values);
        
        return $this->db->fetchOne(
            "SELECT * FROM UserAchievements WHERE ID_user_achievement = ?",
            [$id]
        );
    }
    
    public function delete($id) {
        return $this->db->execute(
            "DELETE FROM UserAchievements WHERE ID_user_achievement = ?",
            [$id]
        ) > 0;
    }
}
?>