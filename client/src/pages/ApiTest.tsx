import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, X } from "lucide-react";
import { phpApiClient } from '@/lib/phpApiClient';

interface ApiTestResult {
  endpoint: string;
  status: 'pending' | 'success' | 'error';
  data?: any;
  error?: string;
}

export default function ApiTest() {
  const [testResults, setTestResults] = useState<ApiTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const testEndpoints = [
    { name: 'Тест подключения', endpoint: 'testConnection' },
    { name: 'Получить пользователей', endpoint: 'getUser', params: [1] },
    { name: 'Получить достижения', endpoint: 'getAllAchievements' },
    { name: 'Получить уровни', endpoint: 'getLevels' },
    { name: 'Получить типы достижений', endpoint: 'getTypesOfAchievements' },
    { name: 'Получить курсы', endpoint: 'getCourses' },
    { name: 'Получить компетенции', endpoint: 'getCompetencies' },
    { name: 'Получить KPI пользователя', endpoint: 'getUserKPI', params: [1] },
    { name: 'Получить достижения пользователя', endpoint: 'getUserAchievements', params: [1] },
  ];

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    for (const test of testEndpoints) {
      const result: ApiTestResult = {
        endpoint: test.name,
        status: 'pending'
      };

      setTestResults(prev => [...prev, result]);

      try {
        const method = phpApiClient[test.endpoint as keyof typeof phpApiClient] as any;
        const data = test.params ? await method(...test.params) : await method();
        console.log(method);
        console.log(data);

        setTestResults(prev => 
          prev.map(r => 
            r.endpoint === test.name 
              ? { ...r, status: 'success' as const, data }
              : r
          )
        );
      } catch (error) {
        setTestResults(prev => 
          prev.map(r => 
            r.endpoint === test.name 
              ? { ...r, status: 'error' as const, error: error instanceof Error ? error.message : 'Неизвестная ошибка' }
              : r
          )
        );
      }

      // Небольшая задержка между тестами
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: ApiTestResult['status']) => {
    switch (status) {
      case 'pending':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'success':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'error':
        return <X className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusBadge = (status: ApiTestResult['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Выполняется</Badge>;
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">Успешно</Badge>;
      case 'error':
        return <Badge variant="destructive">Ошибка</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Тестирование PHP API</h1>
        <p className="text-gray-600 mt-2">
          Проверка интеграции с системой цифрового портфолио ИрГУПС
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Тестирование API endpoints</CardTitle>
          <CardDescription>
            Проверка работоспособности всех endpoints PHP API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={runTests} 
            disabled={isRunning}
            className="w-full mb-4"
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Выполняется тестирование...
              </>
            ) : (
              'Запустить тесты'
            )}
          </Button>

          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(result.status)}
                  <span className="font-medium">{result.endpoint}</span>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(result.status)}
                  {result.data && (
                    <span className="text-sm text-gray-500">
                      {Array.isArray(result.data) ? `${result.data.length} записей` : 'Данные получены'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Детали тестирования</CardTitle>
            <CardDescription>
              Подробная информация о результатах тестов
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div key={index} className="border-l-4 border-gray-200 pl-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    {getStatusIcon(result.status)}
                    {result.endpoint}
                  </h4>
                  
                  {result.status === 'success' && result.data && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-2">Результат:</p>
                      <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {result.status === 'error' && result.error && (
                    <div className="mt-2">
                      <p className="text-sm text-red-600">Ошибка: {result.error}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}