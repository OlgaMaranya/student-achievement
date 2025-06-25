<?php
require_once __DIR__ . '/../config/database.php';

class User {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    public function getById($id) {
        return $this->db->fetchOne(
            "SELECT * FROM Users WHERE UserID = ?",
            [$id]
        );
    }
    
    public function getByEmail($email) {
        return $this->db->fetchOne(
            "SELECT * FROM Users WHERE Email = ?",
            [$email]
        );
    }
    
    public function create($userData) {
        $this->db->execute(
            "INSERT INTO Users (FirstName, LastName, Email, Phone, RegistrationDate) VALUES (?, ?, ?, ?, NOW())",
            [$userData['FirstName'], $userData['LastName'], $userData['Email'], $userData['Phone']]
        );
        
        return $this->getById($this->db->lastInsertId());
    }
    
    public function update($id, $userData) {
        $fields = [];
        $values = [];
        
        if (isset($userData['FirstName'])) {
            $fields[] = 'FirstName = ?';
            $values[] = $userData['FirstName'];
        }
        if (isset($userData['LastName'])) {
            $fields[] = 'LastName = ?';
            $values[] = $userData['LastName'];
        }
        if (isset($userData['Email'])) {
            $fields[] = 'Email = ?';
            $values[] = $userData['Email'];
        }
        if (isset($userData['Phone'])) {
            $fields[] = 'Phone = ?';
            $values[] = $userData['Phone'];
        }
        
        if (empty($fields)) {
            return $this->getById($id);
        }
        
        $values[] = $id;
        $sql = "UPDATE Users SET " . implode(', ', $fields) . " WHERE UserID = ?";
        $this->db->execute($sql, $values);
        
        return $this->getById($id);
    }
    
    public function getUserCourses($userId) {
        return $this->db->fetchAll(
            "SELECT c.*, pd.ActionType, pd.Timestamp 
             FROM ProcessData pd
             JOIN Courses c ON pd.CourseID = c.CourseID
             WHERE pd.UserID = ?
             ORDER BY pd.Timestamp DESC",
            [$userId]
        );
    }
    
    public function getAssessmentData($userId) {
        return $this->db->fetchAll(
            "SELECT ad.*, at.TypeName 
             FROM AssessmentData ad
             JOIN AssessmentTypes at ON ad.TypeID = at.TypeID
             WHERE ad.UserID = ?
             ORDER BY ad.Timestamp DESC",
            [$userId]
        );
    }
    
    public function getDiagnosticData($userId) {
        return $this->db->fetchAll(
            "SELECT dd.*, dt.ToolName, c.CompetencyName 
             FROM DiagnosticData dd
             JOIN DiagnosticTools dt ON dd.ToolID = dt.ToolID
             JOIN Competencies c ON dd.CompetencyID = c.CompetencyID
             WHERE dd.UserID = ?
             ORDER BY dd.Timestamp DESC",
            [$userId]
        );
    }
    
    public function getUserProjects($userId) {
        return $this->db->fetchAll(
            "SELECT p.*, pd.Role, pd.Contribution, e.CompanyName 
             FROM ParticipationData pd
             JOIN Projects p ON pd.ActivityID = p.ProjectID
             JOIN Employers e ON p.PartnerID = e.EmployerID
             WHERE pd.UserID = ?
             ORDER BY pd.Timestamp DESC",
            [$userId]
        );
    }
    
    public function getParticipationData($userId) {
        return $this->db->fetchAll(
            "SELECT pd.*, a.ActivityName 
             FROM ParticipationData pd
             JOIN Activities a ON pd.ActivityID = a.ActivityID
             WHERE pd.UserID = ?
             ORDER BY pd.Timestamp DESC",
            [$userId]
        );
    }
    
    public function getAllCourses() {
        return $this->db->fetchAll("SELECT * FROM Courses");
    }
    
    public function getAllCompetencies() {
        return $this->db->fetchAll("SELECT * FROM Competencies");
    }
    
    public function getAllProjects() {
        return $this->db->fetchAll(
            "SELECT p.*, e.CompanyName 
             FROM Projects p
             JOIN Employers e ON p.PartnerID = e.EmployerID
             ORDER BY p.StartDate DESC"
        );
    }
}
?>