
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Info } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AddAchievement = () => {
  const [formData, setFormData] = useState({
    category: "",
    level: "",
    type: "",
    title: "",
    description: "",
    date: "",
    document: null
  });

  const [predictedPoints, setPredictedPoints] = useState(0);
  const [controlOrgan, setControlOrgan] = useState("");
  const [validityPeriod, setValidityPeriod] = useState("");

  const handleCategoryLevelChange = () => {
    // Логика расчета баллов на основе категории, уровня и типа участия
    if (formData.category && formData.level && formData.type) {
      let points = 0;
      let organ = "";
      let validity = "";

      if (formData.category === "Научная деятельность") {
        if (formData.level === "Международный") {
          points = formData.type === "Победитель" ? 30 : formData.type === "Призёр (2 место)" ? 25 : 15;
          organ = "Научное управление";
          validity = "3 года";
        } else if (formData.level === "Всероссийский") {
          points = formData.type === "Победитель" ? 25 : formData.type === "Призёр (2 место)" ? 20 : 12;
          organ = "Научное управление";
          validity = "2 года";
        }
      } else if (formData.category === "Учебная деятельность") {
        if (formData.level === "Международный") {
          points = formData.type === "Победитель" ? 25 : formData.type === "Призёр (2 место)" ? 20 : 10;
          organ = "Учебное управление";
          validity = "2 года";
        }
      } else if (formData.category === "Спортивная деятельность") {
        if (formData.level === "Внутривузовский") {
          points = formData.type === "Победитель" ? 10 : formData.type === "Призёр (2 место)" ? 8 : 5;
          organ = "Кафедра физической культуры";
          validity = "1 год";
        }
      }

      setPredictedPoints(points);
      setControlOrgan(organ);
      setValidityPeriod(validity);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Добавить достижение</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Новое достижение</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="category">Категория *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => {
                  setFormData({ ...formData, category: value });
                  setTimeout(handleCategoryLevelChange, 100);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Учебная деятельность">Учебная деятельность</SelectItem>
                  <SelectItem value="Научная деятельность">Научная деятельность</SelectItem>
                  <SelectItem value="Спортивная деятельность">Спортивная деятельность</SelectItem>
                  <SelectItem value="Культурно-творческая деятельность">Культурно-творческая деятельность</SelectItem>
                  <SelectItem value="Общественная деятельность">Общественная деятельность</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="level">Уровень *</Label>
              <Select 
                value={formData.level} 
                onValueChange={(value) => {
                  setFormData({ ...formData, level: value });
                  setTimeout(handleCategoryLevelChange, 100);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите уровень" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Международный">Международный</SelectItem>
                  <SelectItem value="Всероссийский">Всероссийский</SelectItem>
                  <SelectItem value="Региональный">Региональный</SelectItem>
                  <SelectItem value="Внутривузовский">Внутривузовский</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Тип участия *</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => {
                  setFormData({ ...formData, type: value });
                  setTimeout(handleCategoryLevelChange, 100);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Участие">Участие</SelectItem>
                  <SelectItem value="Призёр (3 место)">Призёр (3 место)</SelectItem>
                  <SelectItem value="Призёр (2 место)">Призёр (2 место)</SelectItem>
                  <SelectItem value="Победитель">Победитель</SelectItem>
                  <SelectItem value="Получение награды">Получение награды</SelectItem>
                  <SelectItem value="Систематическое участие">Систематическое участие</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {predictedPoints > 0 && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p><strong>Предполагаемые баллы:</strong> {predictedPoints}</p>
                  <p><strong>Контролирующий орган:</strong> {controlOrgan}</p>
                  <p><strong>Срок действия:</strong> {validityPeriod}</p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="title">Название достижения *</Label>
            <Input
              id="title"
              placeholder="Введите название мероприятия или достижения"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              placeholder="Дополнительная информация о достижении"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="date">Дата получения *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="document">Документ подтверждения *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-2">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    Загрузите файл
                  </span>
                  <span className="mt-1 block text-xs text-gray-500">
                    PDF, JPG, PNG до 10MB
                  </span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Отправить на подтверждение
            </Button>
            <Button variant="outline">
              Сохранить как черновик
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddAchievement;
