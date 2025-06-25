<?php
// Запуск PHP встроенного сервера для API
$host = '0.0.0.0';
$port = 8080;
$docroot = __DIR__ . '/php-api';

echo "Запуск PHP API сервера для системы ИрГУПС...\n";
echo "Хост: {$host}\n";
echo "Порт: {$port}\n";
echo "Корневая папка: {$docroot}\n";
echo "API будет доступно по адресу: http://{$host}:{$port}\n\n";

// Переход в директорию API
chdir($docroot);

// Запуск встроенного сервера PHP
$command = "php -S {$host}:{$port}";
echo "Выполняется команда: {$command}\n";
exec($command);
?>