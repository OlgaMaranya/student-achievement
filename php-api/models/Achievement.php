<?php
require_once __DIR__ . '/../config/database.php';

class Achievement {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    public function getById($id) {
        return $this->db->fetchOne(
            "SELECT * FROM Achievements WHERE ID_achievement = ?",
            [$id]
        );
    }
    
    public function getAll() {
        return $this->db->fetchAll(
            "SELECT a.*, l.Name as LevelName, t.Name as TypeName 
             FROM Achievements a
             JOIN Levels l ON a.Level_id = l.ID_level
             JOIN TypesOfAchievements t ON a.Type_id = t.ID_type"
        );
    }
    
    public function getLevels() {
        return $this->db->fetchAll("SELECT * FROM Levels");
    }
    
    public function getTypesOfAchievements() {
        return $this->db->fetchAll("SELECT * FROM TypesOfAchievements");
    }
    
    public function getActivities() {
        return $this->db->fetchAll("SELECT * FROM Activities");
    }
}
?>