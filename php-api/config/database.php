<?php
class Database {
    private static $instance = null;
    private $connection;
    
    // Конфигурация базы данных - используем переменные окружения
    private $host;
    private $username;
    private $password;
    private $database;
    private $port;
    
    private function __construct() {
        // Получаем параметры подключения из переменных окружения
        // $database_url = getenv('DATABASE_URL');
        
        // if ($database_url) {
        //     // Парсим DATABASE_URL
        //     $url_parts = parse_url($database_url);
        //     $this->host = $url_parts['host'];
        //     $this->username = $url_parts['user'];
        //     $this->password = $url_parts['pass'];
        //     $this->database = ltrim($url_parts['path'], '/');
        //     $this->port = $url_parts['port'] ?? 3306;
        // } else {
        //     // Fallback на отдельные переменные окружения
        //     $this->host = getenv('DB_HOST') ?: 'localhost';
        //     $this->username = getenv('DB_USERNAME') ?: 'root';
        //     $this->password = getenv('DB_PASSWORD') ?: '';
        //     $this->database = getenv('DB_DATABASE') ?: 'irgups_portfolio';
        //     $this->port = getenv('DB_PORT') ?: 3306;
        // }

        $this->host = 'hq-srv-eis-new.irgups.ru';
        $this->username = 'eis_irgups';
        $this->password = 'eis_irgups';
        $this->database = 'eis_irgups_avatar';
        // $this->port = getenv('DB_PORT') ?: 3306;

        try {
            // Подключение к PostgreSQL
            // $dsn = "mysql:host={$this->host};port={$this->port};dbname={$this->database};charset=utf8mb4";
            $dsn = "mysql:host={$this->host};dbname={$this->database};charset=utf8mb4";
            $this->connection = new PDO($dsn, $this->username, $this->password);
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception("Ошибка подключения к базе данных: " . $e->getMessage());
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->connection;
    }
    
    // Вспомогательные методы для выполнения запросов
    public function query($sql, $params = []) {
        try {
            $stmt = $this->connection->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            throw new Exception("Ошибка выполнения запроса: " . $e->getMessage());
        }
    }
    
    public function fetchAll($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        return $stmt->fetchAll();
    }
    
    public function fetchOne($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        return $stmt->fetch();
    }
    
    public function execute($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        return $stmt->rowCount();
    }
    
    public function lastInsertId() {
        return $this->connection->lastInsertId();
    }
}
?>