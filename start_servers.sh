#!/bin/bash

# Скрипт для запуска PHP API сервера и React приложения
echo "Запуск системы цифрового портфолио ИрГУПС..."

# Запуск PHP API сервера на порту 8080
echo "Запуск PHP API сервера..."
cd php-api
php -S 0.0.0.0:8080 &
PHP_PID=$!
cd ..

# Ожидание запуска PHP сервера
sleep 2

echo "PHP API запущен на порту 8080 (PID: $PHP_PID)"
echo "Теперь запустите React приложение командой: npm run dev"
echo "Или нажмите Ctrl+C для остановки PHP сервера"

# Ожидание сигнала завершения
trap "kill $PHP_PID; exit" SIGINT SIGTERM

wait $PHP_PID
