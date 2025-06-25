#!/bin/bash

# Скрипт инициализации базы данных ИрГУПС
echo "Настройка MySQL базы данных для системы цифрового портфолио ИрГУПС..."

# Запуск MySQL сервера
mysqld_safe --user=mysql --datadir=/var/lib/mysql &
sleep 5

# Создание базы данных
mysql -u root -e "CREATE DATABASE IF NOT EXISTS irgups_portfolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Импорт структуры базы данных
mysql -u root irgups_portfolio < php-api/database_schema.sql

# Создание пользователя для подключения
mysql -u root -e "CREATE USER IF NOT EXISTS 'irgups_user'@'localhost' IDENTIFIED BY 'irgups_password';"
mysql -u root -e "GRANT ALL PRIVILEGES ON irgups_portfolio.* TO 'irgups_user'@'localhost';"
mysql -u root -e "FLUSH PRIVILEGES;"

echo "База данных настроена успешно!"
echo "Данные подключения:"
echo "  Хост: localhost"
echo "  База данных: irgups_portfolio" 
echo "  Пользователь: irgups_user"
echo "  Пароль: irgups_password"