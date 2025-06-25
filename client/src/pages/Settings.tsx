
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { User, Bell, Lock, Save } from "lucide-react";

const Settings = () => {
  const [profile, setProfile] = useState({
    firstName: "Иван",
    lastName: "Иванов",
    email: "ivanov@student.irgups.ru",
    group: "ИВТ-20-1",
    phone: "+7 (999) 123-45-67"
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    achievementUpdates: true,
    recommendations: false,
    weeklyReport: true
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Настройки</h1>
      </div>

      {/* Профиль */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Профиль
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Имя</Label>
              <Input
                id="firstName"
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Фамилия</Label>
              <Input
                id="lastName"
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="group">Группа</Label>
              <Input
                id="group"
                value={profile.group}
                onChange={(e) => setProfile({ ...profile, group: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Save className="h-4 w-4 mr-2" />
            Сохранить профиль
          </Button>
        </CardContent>
      </Card>

      {/* Уведомления */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Уведомления
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Email уведомления</div>
              <div className="text-xs text-gray-500">Получать уведомления на электронную почту</div>
            </div>
            <Switch
              checked={notifications.emailNotifications}
              onCheckedChange={(checked) => 
                setNotifications({ ...notifications, emailNotifications: checked })
              }
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Обновления достижений</div>
              <div className="text-xs text-gray-500">Уведомления о подтверждении/отклонении достижений</div>
            </div>
            <Switch
              checked={notifications.achievementUpdates}
              onCheckedChange={(checked) => 
                setNotifications({ ...notifications, achievementUpdates: checked })
              }
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Рекомендации</div>
              <div className="text-xs text-gray-500">Персональные рекомендации по развитию</div>
            </div>
            <Switch
              checked={notifications.recommendations}
              onCheckedChange={(checked) => 
                setNotifications({ ...notifications, recommendations: checked })
              }
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Еженедельный отчет</div>
              <div className="text-xs text-gray-500">Еженедельная сводка по рейтингу и достижениям</div>
            </div>
            <Switch
              checked={notifications.weeklyReport}
              onCheckedChange={(checked) => 
                setNotifications({ ...notifications, weeklyReport: checked })
              }
            />
          </div>
          
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Save className="h-4 w-4 mr-2" />
            Сохранить настройки
          </Button>
        </CardContent>
      </Card>

      {/* Смена пароля */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Безопасность
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Текущий пароль</Label>
            <Input
              id="currentPassword"
              type="password"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="newPassword">Новый пароль</Label>
            <Input
              id="newPassword"
              type="password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Подтвердите новый пароль</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
            />
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Lock className="h-4 w-4 mr-2" />
            Изменить пароль
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
