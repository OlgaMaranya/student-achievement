
import { Home, Calendar, Plus, Archive, Settings, TestTube } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Главная",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Мои достижения",
    url: "/achievements",
    icon: Calendar,
  },
  {
    title: "Добавить достижение",
    url: "/add-achievement",
    icon: Plus,
  },
  {
    title: "Архив",
    url: "/archive",
    icon: Archive,
  },
  {
    title: "Рекомендации",
    url: "/recommendations",
    icon: Archive,
  },
  {
    title: "Настройки",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Тест API",
    url: "/api-test",
    icon: TestTube,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarHeader className="p-4 bg-white border-b border-gray-200">
        <div className="text-[#017870] font-bold text-lg">
          Цифровое портфолио
        </div>
        <div className="text-gray-600 text-sm">
          ИрГУПС
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500 font-medium">Навигация</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className="text-gray-700 hover:bg-gray-100 hover:text-[#017870] data-[active=true]:bg-[#017870] data-[active=true]:text-white transition-colors"
                  >
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) => 
                        `flex items-center gap-2 ${isActive ? 'font-medium text-white' : 'text-gray-700'}`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
