
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { Header } from "./Header";
import { SidebarInset } from "@/components/ui/sidebar";

const Layout = () => {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
        <footer className="border-t bg-white py-4 px-6 text-center text-sm text-gray-600">
          © ИрГУПС, 2025 | Цифровой профиль обучающегося
        </footer>
      </SidebarInset>
    </>
  );
};

export default Layout;
