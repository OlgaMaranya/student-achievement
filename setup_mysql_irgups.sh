#!/bin/bash

# Инициализация MySQL для системы ИрГУПС
echo "Настройка MySQL базы данных ИрГУПС..."

# Создание директории для MySQL данных
mkdir -p /tmp/mysql-data

# Инициализация MySQL с правильными правами
mysqld --initialize-insecure --user=$USER --datadir=/tmp/mysql-data

# Запуск MySQL сервера в фоновом режиме
mysqld --user=$USER --datadir=/tmp/mysql-data --socket=/tmp/mysql.sock --port=3306 --skip-networking=0 --bind-address=127.0.0.1 &

# Ожидание запуска сервера
sleep 10

# Создание базы данных и пользователя
mysql --socket=/tmp/mysql.sock -u root -e "CREATE DATABASE IF NOT EXISTS irgups_portfolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql --socket=/tmp/mysql.sock -u root -e "CREATE USER IF NOT EXISTS 'irgups_user'@'localhost' IDENTIFIED BY 'irgups_password';"
mysql --socket=/tmp/mysql.sock -u root -e "GRANT ALL PRIVILEGES ON irgups_portfolio.* TO 'irgups_user'@'localhost';"
mysql --socket=/tmp/mysql.sock -u root -e "FLUSH PRIVILEGES;"

# Импорт структуры базы данных из оригинального файла ИрГУПС
if [ -f "php-api/database_schema.sql" ]; then
    echo "Импорт структуры базы данных ИрГУПС..."
    mysql --socket=/tmp/mysql.sock -u root irgups_portfolio < php-api/database_schema.sql
    echo "Структура базы данных импортирована успешно!"
else
    echo "Файл структуры базы данных не найден"
fi

echo "MySQL сервер запущен для системы ИрГУПС"
echo "Соединение: mysql --socket=/tmp/mysql.sock -u irgups_user -pirgups_password irgups_portfolio"