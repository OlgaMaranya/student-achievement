<?php
require_once __DIR__ . '/../models/KPI.php';

class KPIController {
    private $kpiModel;
    
    public function __construct() {
        $this->kpiModel = new KPI();
    }
    
    public function getUserKPI($userId) {
        try {
            $kpi = $this->kpiModel->getUserKPI($userId);
            if (!$kpi) {
                // Если KPI не найден, создаем новый на основе достижений
                $totalPoints = $this->kpiModel->calculateTotalPoints($userId);
                $categoryRatings = $this->kpiModel->calculateCategoryRatings($userId);
                
                $kpiData = [
                    'Total_points' => $totalPoints,
                    'Semester_rating' => $totalPoints,
                    'Academic_rating' => $this->getCategoryPoints($categoryRatings, 'Academic'),
                    'Scientific_rating' => $this->getCategoryPoints($categoryRatings, 'Scientific'),
                    'Cultural_rating' => $this->getCategoryPoints($categoryRatings, 'Cultural'),
                    'Sports_rating' => $this->getCategoryPoints($categoryRatings, 'Sports'),
                    'Social_rating' => $this->getCategoryPoints($categoryRatings, 'Social'),
                    'Valid_from' => date('Y-m-d')
                ];
                
                $kpi = $this->kpiModel->create($userId, $kpiData);
            }
            echo json_encode($kpi);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Ошибка получения KPI: ' . $e->getMessage()]);
        }
    }
    
    public function updateUserKPI($userId) {
        try {
            // Пересчитываем KPI на основе текущих достижений
            $totalPoints = $this->kpiModel->calculateTotalPoints($userId);
            $categoryRatings = $this->kpiModel->calculateCategoryRatings($userId);
            
            $kpiData = [
                'Total_points' => $totalPoints,
                'Semester_rating' => $totalPoints,
                'Academic_rating' => $this->getCategoryPoints($categoryRatings, 'Academic'),
                'Scientific_rating' => $this->getCategoryPoints($categoryRatings, 'Scientific'),
                'Cultural_rating' => $this->getCategoryPoints($categoryRatings, 'Cultural'),
                'Sports_rating' => $this->getCategoryPoints($categoryRatings, 'Sports'),
                'Social_rating' => $this->getCategoryPoints($categoryRatings, 'Social'),
                'Valid_from' => date('Y-m-d')
            ];
            
            $kpi = $this->kpiModel->create($userId, $kpiData);
            echo json_encode($kpi);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Ошибка обновления KPI: ' . $e->getMessage()]);
        }
    }
    
    private function getCategoryPoints($categoryRatings, $category) {
        foreach ($categoryRatings as $rating) {
            if ($rating['Category'] === $category) {
                return $rating['category_points'];
            }
        }
        return 0;
    }
}
?>