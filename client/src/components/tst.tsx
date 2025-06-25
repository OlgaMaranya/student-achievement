import React, { useEffect } from 'react';

const Tst = () => {
    useEffect(() => {
        // URL тестового эндпоинта
        const url = 'http://localhost:8080/test.php';

        // Выполняем fetch-запрос
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ошибка: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Успех! Сервер ответил:', data);
            })
            .catch(error => {
                console.error('Ошибка подключения к API:', error);
            });
    }, []); // Пустой массив зависимостей — вызов один раз при монтировании

    return (
        <div>
            <p>Проверка соединения с API...</p>
        </div>
    );
};

export default Tst;