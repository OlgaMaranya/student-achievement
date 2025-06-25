
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Trophy, Users, AlertCircle } from "lucide-react";
import { RatingChart } from "@/components/RatingChart";
import { CategoryChart } from "@/components/CategoryChart";
import { useQuery } from "@tanstack/react-query";

const Home = () => {
  // Получение данных пользователя и его KPI
  const { data: user, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ['/api/users', 1],
    queryFn: () => fetch('/api/users/1').then(res => res.json())
  });

  const { data: kpi, isLoading: kpiLoading, error: kpiError } = useQuery({
    queryKey: ['/api/users', 1, 'kpi'],
    queryFn: () => fetch('/api/users/1/kpi').then(res => res.json())
  });

  const { data: achievements, isLoading: achievementsLoading } = useQuery({
    queryKey: ['/api/users', 1, 'achievements'],
    queryFn: () => fetch('/api/users/1/achievements').then(res => res.json())
  });

  if (userError || kpiError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-gray-600">Ошибка загрузки данных</p>
        </div>
      </div>
    );
  }

  if (userLoading || kpiLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  const currentRating = kpi?.Total_points || 0;
  const academicRating = kpi?.Academic_rating || 0;
  const scientificRating = kpi?.Scientific_rating || 0;
  const culturalRating = kpi?.Cultural_rating || 0;
  const sportsRating = kpi?.Sports_rating || 0;
  const socialRating = kpi?.Social_rating || 0;
  
  // Симуляция предыдущего рейтинга для демонстрации динамики
  const previousRating = Math.max(0, currentRating - 10);
  const ratingChange = currentRating - previousRating;
  
  // Рассчет позиции в рейтинге (упрощенная логика)
  const topPercentage = currentRating > 200 ? 10 : currentRating > 150 ? 25 : currentRating > 100 ? 50 : 75;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Цифровое портфолио студента
          </h1>
          {user && (
            <p className="text-lg text-gray-600 mt-1">
              {user.FirstName} {user.LastName}
            </p>
          )}
        </div>
      </div>

      {/* Основные показатели */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Общий рейтинг</CardTitle>
            <Trophy className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentRating} баллов</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {ratingChange >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              )}
              {ratingChange >= 0 ? '+' : ''}{ratingChange} с прошлого месяца
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ваша позиция</CardTitle>
            <Users className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">TOP-{topPercentage}%</div>
            <p className="text-xs text-muted-foreground">
              среди всех студентов
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">До повышенной стипендии</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{70 - currentRating} баллов</div>
            <p className="text-xs text-muted-foreground">
              осталось набрать
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Графики */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Динамика рейтинга за 12 месяцев</CardTitle>
          </CardHeader>
          <CardContent>
            <RatingChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Распределение баллов по категориям</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryChart />
          </CardContent>
        </Card>
      </div>

      {/* Кнопка перехода к полному рейтингу */}
      <div className="flex justify-center">
        <Button 
          size="lg" 
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Перейти к полному рейтингу студентов
        </Button>
      </div>
    </div>
  );
};

export default Home;
