
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Filter, Download, RefreshCw, Plus, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Achievements = () => {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Получение достижений пользователя из API
  const { data: achievements, isLoading, error } = useQuery({
    queryKey: ['/api/users', 1, 'achievements'],
    queryFn: () => fetch('/api/users/101/achievements').then(res => res.json())
  });

  // Получение справочников для фильтров
  const { data: types } = useQuery({
    queryKey: ['/api/types'],
    queryFn: () => fetch('/api/types').then(res => res.json())
  });

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-gray-600">Ошибка загрузки достижений</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-48" />
        </div>
        <Skeleton className="h-32" />
        <div className="space-y-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }

  const getStatusBadge = (achievement: any) => {
    // Для реальных данных ИрГУПС статус будет "подтверждено" если есть документ
    const status = achievement.Document_confirmation ? "подтверждено" : "ожидает";
    
    switch (status) {
      case "подтверждено":
        return <Badge variant="default" className="bg-green-100 text-green-800">Подтверждено</Badge>;
      case "ожидает":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Ожидает</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredAchievements = (achievements || []).filter((achievement: any) => {
    if (categoryFilter !== "all" && achievement.Category !== categoryFilter) return false;
    // Статус определяется наличием подтверждающего документа
    const status = achievement.Document_confirmation ? "подтверждено" : "ожидает";
    if (statusFilter !== "all" && status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Мои достижения</h1>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
          <Link to="/add-achievement">
            <Plus className="h-4 w-4 mr-2" />
            Добавить достижение
          </Link>
        </Button>
      </div>

      {/* Фильтры */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Фильтры
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Категория</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Все категории" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все категории</SelectItem>
                  <SelectItem value="Учебная деятельность">Учебная деятельность</SelectItem>
                  <SelectItem value="Научная деятельность">Научная деятельность</SelectItem>
                  <SelectItem value="Спортивная деятельность">Спортивная деятельность</SelectItem>
                  <SelectItem value="Культурно-творческая деятельность">Культурно-творческая</SelectItem>
                  <SelectItem value="Общественная деятельность">Общественная деятельность</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Статус</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Все статусы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="подтверждено">Подтверждено</SelectItem>
                  <SelectItem value="ожидает">Ожидает подтверждения</SelectItem>
                  <SelectItem value="отклонено">Отклонено</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Список достижений */}
      <div className="space-y-4">
        {filteredAchievements.map((achievement: any) => (
          <Card key={achievement.ID_user_achievement}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{achievement.Title}</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{achievement.Category}</Badge>
                    <Badge variant="outline">{achievement.LevelName}</Badge>
                    <Badge variant="outline">{achievement.TypeName}</Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{achievement.Points} баллов</span> • 
                    <span className="ml-1">{new Date(achievement.Date_received).toLocaleDateString('ru-RU')}</span>
                  </div>
                  {achievement.Document_confirmation && (
                    <div className="text-xs text-gray-500">
                      Документ: {achievement.Document_confirmation}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(achievement)}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" title="Скачать документ">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Нет достижений, соответствующих выбранным фильтрам</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Achievements;
