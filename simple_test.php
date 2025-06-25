<?php
$database_url = getenv('DATABASE_URL');
echo "Testing connection to: " . substr($database_url, 0, 40) . "...\n";

$url_parts = parse_url($database_url);
$host = $url_parts['host'];
$username = $url_parts['user'];
$password = $url_parts['pass'];
$database = ltrim($url_parts['path'], '/');
$port = $url_parts['port'] ?? 5432;

try {
    $dsn = "pgsql:host={$host};port={$port};dbname={$database};sslmode=require";
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✓ Connection successful\n";
    
    $stmt = $pdo->query('SELECT version()');
    $version = $stmt->fetchColumn();
    echo "✓ PostgreSQL version: " . substr($version, 0, 50) . "...\n";
    
    $stmt = $pdo->query('SELECT COUNT(*) FROM "Users"');
    $count = $stmt->fetchColumn();
    echo "✓ Users count: " . $count . "\n";
    
} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>