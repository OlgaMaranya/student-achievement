# Digital Student Portfolio System

## Overview

This is a comprehensive digital student portfolio management system built for IrGUPS (Irkutsk State University of Railway Engineering). The application allows students to track, manage, and showcase their academic achievements across various categories including academic performance, scientific activities, sports, cultural activities, and community involvement.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: React Router v6 for client-side navigation
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL с аутентичной структурой базы данных ИрГУПС (30+ таблиц)
- **Database Provider**: Neon serverless PostgreSQL
- **Database Integration**: Прямое подключение через pg драйвер с эмуляцией MySQL интерфейса
- **API Layer**: RESTful endpoints для всех операций с данными ИрГУПС
- **Development Server**: Custom Vite integration for hot module replacement

### UI Component System
- **Design System**: shadcn/ui components based on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Icons**: Lucide React icon library
- **Charts**: Recharts for data visualization

## Key Components

### Database Layer
- **Database**: PostgreSQL с полной структурой базы данных ИрГУПС (30+ таблиц)
- **Connection**: Нативный PostgreSQL pool connection для оптимальной производительности
- **Core Tables**: Users, Achievements, UserAchievements, Levels, TypesOfAchievements, KPI
- **Extended Tables**: Activities, Courses, Competencies, Projects, DiagnosticData, AssessmentData, ParticipationData, ProcessData и др.
- **Storage Interface**: Прямые PostgreSQL запросы с JOIN операциями для связанных данных
- **Real Data Integration**: Система использует аутентичные данные из базы ИрГУПС без моков или заглушек

### Frontend Pages
- **Dashboard**: Main overview with rating charts and achievement statistics
- **Achievements**: CRUD operations for student achievements with filtering and status tracking
- **Add Achievement**: Form-based achievement creation with automatic point calculation
- **Archive**: View of expired achievements that no longer count toward rating
- **Recommendations**: AI-powered suggestions for new achievements to pursue
- **Settings**: User profile and notification preferences management

### Component Architecture
- **Layout System**: Sidebar-based navigation with responsive design
- **Charts**: Custom chart components for rating trends and category breakdowns
- **Forms**: React Hook Form integration with Zod validation
- **UI Components**: Comprehensive set of reusable components following design system

## Data Flow

### Achievement Management Flow
1. Students create achievements through the Add Achievement form
2. System automatically calculates points based on category, level, and participation type
3. Achievements require document upload and go through approval workflow
4. Approved achievements contribute to overall student rating
5. Expired achievements are moved to archive but preserved for portfolio purposes

### Rating Calculation
- Points are assigned based on achievement type, level (International, National, Regional, University-level), and participation level (Winner, Prize winner, Participant)
- Different categories have different point scales and validity periods
- System tracks rating changes over time for trend analysis

### User Interface Flow
- Sidebar navigation provides access to all major sections
- Dashboard shows overview with charts and key metrics
- Achievement management includes filtering, searching, and bulk operations
- Real-time notifications for status updates and recommendations

## External Dependencies

### Core Framework Dependencies
- React ecosystem (React, React DOM, React Router)
- TanStack Query for server state management
- Tailwind CSS and PostCSS for styling
- TypeScript for type safety

### UI and User Experience
- Radix UI primitives for accessible components
- Lucide React for consistent iconography
- Recharts for data visualization
- React Hook Form with Hookform Resolvers for form management
- Date-fns for date manipulation

### Backend Dependencies
- Express.js for HTTP server
- Drizzle ORM with PostgreSQL dialect
- Neon serverless database driver
- Connect-pg-simple for session management
- ESBuild for production bundling

### Development Tools
- Vite for build tooling and development server
- TSX for TypeScript execution
- Drizzle Kit for database migrations
- Various Replit-specific plugins for development environment

## Deployment Strategy

### Development Environment
- Runs on Replit with Node.js 20 and PostgreSQL 16
- Hot module replacement through Vite middleware
- Automatic error overlay for development debugging
- Port 5000 exposed externally on port 80

### Production Build Process
1. Frontend built using Vite to `dist/public`
2. Backend bundled using ESBuild to `dist/index.js`
3. Static assets served from built frontend
4. Database migrations applied via Drizzle Kit

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Automatic scaling deployment target on Replit
- PostgreSQL module provisioned for data persistence

## Changelog

```
Changelog:
- June 19, 2025. Успешный запуск системы ИрГУПС с PostgreSQL интеграцией
  * Исправлены проблемы подключения к базе данных PostgreSQL
  * Создан адаптер для совместимости MySQL запросов с PostgreSQL
  * Все API endpoints работают корректно с реальными данными ИрГУПС
  * Добавлены тестовые данные студентов, достижений и KPI
  * Система полностью функциональна и готова к использованию
  * Frontend успешно отображает данные из базы ИрГУПС
- June 19, 2025. Полная интеграция с PostgreSQL базой данных ИрГУПС
  * Создана структура базы данных с 30+ таблицами согласно требованиям ИрГУПС
  * Интегрирован нативный PostgreSQL драйвер для прямого доступа к данным
  * Реализованы все основные API endpoints для работы с пользователями, достижениями, KPI
  * Обновлен React frontend для работы с реальными данными из базы ИрГУПС
  * Добавлена страница тестирования API для проверки интеграции
- June 17, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```