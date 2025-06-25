
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Clock } from "lucide-react";

const archivedAchievements = [
  {
    id: 1,
    title: "Участие в олимпиаде по математике",
    category: "Учебная деятельность",
    level: "Региональный",
    type: "Участие",
    points: 8,
    date: "2022-03-15",
    expiredDate: "2024-03-15",
    document: "math_olympiad.pdf"
  },
  {
    id: 2,
    title: "Соревнования по легкой атлетике",
    category: "Спортивная деятельность",
    level: "Внутривузовский",
    type: "Призёр (3 место)",
    points: 6,
    date: "2021-09-20",
    expiredDate: "2022-09-20",
    document: "athletics.jpg"
  },
];

const Archive = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Архив достижений</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-500" />
            Информация об архиве
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Эти достижения сохранены в портфолио, но не учитываются в текущем рейтинге из-за истечения срока действия.
            Вы можете просматривать документы и использовать их для составления резюме или других целей.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {archivedAchievements.map((achievement) => (
          <Card key={achievement.id} className="opacity-75">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-700">{achievement.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-gray-500 border-gray-300">
                      {achievement.category}
                    </Badge>
                    <Badge variant="outline" className="text-gray-500 border-gray-300">
                      {achievement.level}
                    </Badge>
                    <Badge variant="outline" className="text-gray-500 border-gray-300">
                      {achievement.type}
                    </Badge>
                    <Badge variant="destructive" className="bg-red-100 text-red-800">
                      Просрочено
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">{achievement.points} баллов</span> • 
                    <span className="ml-1">
                      Получено: {new Date(achievement.date).toLocaleDateString('ru-RU')}
                    </span> • 
                    <span className="ml-1">
                      Просрочено: {new Date(achievement.expiredDate).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" className="text-gray-500">
                    <Download className="h-4 w-4" />
                    Скачать документ
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {archivedAchievements.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">В архиве пока нет просроченных достижений</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Archive;
