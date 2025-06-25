
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Lightbulb, TrendingUp, Star } from "lucide-react";

const recommendations = [
  {
    id: 1,
    title: "Участие в международной конференции",
    description: "Подайте заявку на участие в международной конференции по вашей специальности",
    category: "Научная деятельность",
    points: 15,
    difficulty: "Средняя",
    timeToComplete: "2-3 месяца",
    priority: "high"
  },
  {
    id: 2,
    title: "Сдача норм ГТО",
    description: "Получите золотой, серебряный или бронзовый знак ГТО",
    category: "Спортивная деятельность",
    points: 12,
    difficulty: "Легкая",
    timeToComplete: "1 месяц",
    priority: "medium"
  },
  {
    id: 3,
    title: "Организация студенческого мероприятия",
    description: "Станьте организатором культурного или образовательного мероприятия в университете",
    category: "Общественная деятельность",
    points: 18,
    difficulty: "Высокая",
    timeToComplete: "3-4 месяца",
    priority: "high"
  },
  {
    id: 4,
    title: "Участие в олимпиаде по программированию",
    description: "Примите участие во всероссийской олимпиаде по программированию",
    category: "Учебная деятельность",
    points: 20,
    difficulty: "Высокая",
    timeToComplete: "1-2 месяца",
    priority: "medium"
  },
];

const Recommendations = () => {
  const currentRating = 66;
  const targetRating = 70;
  const remainingPoints = targetRating - currentRating;

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">Высокий приоритет</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Средний приоритет</Badge>;
      case "low":
        return <Badge className="bg-green-100 text-green-800">Низкий приоритет</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Легкая":
        return "text-green-600";
      case "Средняя":
        return "text-yellow-600";
      case "Высокая":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Рекомендации</h1>
      </div>

      {/* Цель */}
      <Card className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-800">
            <Target className="h-5 w-5" />
            Ваша цель
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-emerald-700">
              Чтобы попасть в список студентов на повышенную стипендию, вам нужно набрать минимум <strong>70 баллов</strong>
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-emerald-200 rounded-full h-3">
                <div 
                  className="bg-emerald-600 h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${(currentRating / targetRating) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-emerald-800">
                {currentRating}/{targetRating} баллов
              </span>
            </div>
            <p className="text-sm text-emerald-600">
              Осталось набрать: <strong>{remainingPoints} баллов</strong>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Рекомендации */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Персональные рекомендации
        </h2>

        {recommendations.map((recommendation) => (
          <Card key={recommendation.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{recommendation.title}</h3>
                    {getPriorityBadge(recommendation.priority)}
                  </div>
                  
                  <p className="text-gray-600">{recommendation.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{recommendation.category}</Badge>
                    <Badge 
                      variant="outline" 
                      className={getDifficultyColor(recommendation.difficulty)}
                    >
                      {recommendation.difficulty}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-500 space-y-1">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span><strong>{recommendation.points} баллов</strong> при успешном выполнении</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                      <span>Время выполнения: {recommendation.timeToComplete}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    Начать
                  </Button>
                  <Button variant="outline" size="sm">
                    Подробнее
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Дополнительная информация */}
      <Card>
        <CardHeader>
          <CardTitle>Как работают рекомендации?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Рекомендации формируются на основе вашего текущего рейтинга и активности</p>
            <p>• Приоритет определяется близостью к дедлайнам и потенциальной пользой</p>
            <p>• Сложность оценивается исходя из ваших предыдущих достижений</p>
            <p>• Система обновляется еженедельно с учетом новых возможностей</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Recommendations;
