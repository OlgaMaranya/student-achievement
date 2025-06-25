import React, { useEffect } from 'react';

const Tst = () => {
    useEffect(() => {
        // URL ��������� ���������
        const url = 'http://localhost:8080/test.php';

        // ��������� fetch-������
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ������: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('�����! ������ �������:', data);
            })
            .catch(error => {
                console.error('������ ����������� � API:', error);
            });
    }, []); // ������ ������ ������������ � ����� ���� ��� ��� ������������

    return (
        <div>
            <p>�������� ���������� � API...</p>
        </div>
    );
};

export default Tst;