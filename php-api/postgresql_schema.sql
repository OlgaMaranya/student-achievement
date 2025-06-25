-- Структура базы данных ИрГУПС для PostgreSQL
-- Система цифрового портфолио студентов

-- Создание таблицы пользователей
CREATE TABLE IF NOT EXISTS "Users" (
    "UserID" SERIAL PRIMARY KEY,
    "FirstName" VARCHAR(50) NOT NULL,
    "LastName" VARCHAR(50) NOT NULL,
    "Email" VARCHAR(100) UNIQUE NOT NULL,
    "Phone" VARCHAR(20),
    "RegistrationDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы ролей пользователей
CREATE TABLE IF NOT EXISTS "UserRoles" (
    "RoleID" SERIAL PRIMARY KEY,
    "RoleName" VARCHAR(50) NOT NULL
);

-- Создание таблицы уровней достижений
CREATE TABLE IF NOT EXISTS "Levels" (
    "ID_level" SERIAL PRIMARY KEY,
    "Name" VARCHAR(50) NOT NULL,
    "Description" TEXT
);

-- Создание таблицы типов достижений
CREATE TABLE IF NOT EXISTS "TypesOfAchievements" (
    "ID_type" SERIAL PRIMARY KEY,
    "Name" VARCHAR(100) NOT NULL,
    "Description" TEXT
);

-- Создание таблицы достижений
CREATE TABLE IF NOT EXISTS "Achievements" (
    "ID_achievement" SERIAL PRIMARY KEY,
    "Title" VARCHAR(255) NOT NULL,
    "Category" VARCHAR(50) NOT NULL,
    "Points" INTEGER NOT NULL,
    "Validity_period" VARCHAR(50),
    "Control_body" VARCHAR(100),
    "Level_id" INTEGER REFERENCES "Levels"("ID_level"),
    "Type_id" INTEGER REFERENCES "TypesOfAchievements"("ID_type")
);

-- Создание таблицы достижений пользователей
CREATE TABLE IF NOT EXISTS "UserAchievements" (
    "ID_user_achievement" SERIAL PRIMARY KEY,
    "FK_user_id" INTEGER REFERENCES "Users"("UserID"),
    "FK_achievement_id" INTEGER REFERENCES "Achievements"("ID_achievement"),
    "Date_received" DATE NOT NULL,
    "Document_confirmation" TEXT
);

-- Создание таблицы KPI
CREATE TABLE IF NOT EXISTS "KPI" (
    "ID_kpi" SERIAL PRIMARY KEY,
    "FK_user_id" INTEGER REFERENCES "Users"("UserID"),
    "Total_points" INTEGER NOT NULL DEFAULT 0,
    "Semester_rating" INTEGER NOT NULL DEFAULT 0,
    "Academic_rating" INTEGER NOT NULL DEFAULT 0,
    "Scientific_rating" INTEGER NOT NULL DEFAULT 0,
    "Cultural_rating" INTEGER NOT NULL DEFAULT 0,
    "Sports_rating" INTEGER NOT NULL DEFAULT 0,
    "Social_rating" INTEGER NOT NULL DEFAULT 0,
    "Valid_from" DATE NOT NULL,
    "Valid_to" DATE
);

-- Создание таблицы курсов
CREATE TABLE IF NOT EXISTS "Courses" (
    "CourseID" SERIAL PRIMARY KEY,
    "CourseName" VARCHAR(100) NOT NULL,
    "Duration" INTEGER NOT NULL,
    "Description" TEXT
);

-- Создание таблицы компетенций
CREATE TABLE IF NOT EXISTS "Competencies" (
    "CompetencyID" SERIAL PRIMARY KEY,
    "CompetencyName" VARCHAR(100) NOT NULL,
    "Description" TEXT
);

-- Создание таблицы активностей
CREATE TABLE IF NOT EXISTS "Activities" (
    "ActivityID" SERIAL PRIMARY KEY,
    "ActivityName" VARCHAR(100) NOT NULL,
    "Description" TEXT
);

-- Создание таблицы проектов
CREATE TABLE IF NOT EXISTS "Projects" (
    "ProjectID" SERIAL PRIMARY KEY,
    "ProjectName" VARCHAR(100) NOT NULL,
    "Description" TEXT,
    "StartDate" DATE,
    "EndDate" DATE,
    "PartnerID" INTEGER
);

-- Создание таблицы работодателей
CREATE TABLE IF NOT EXISTS "Employers" (
    "EmployerID" SERIAL PRIMARY KEY,
    "CompanyName" VARCHAR(100) NOT NULL,
    "ContactInfo" TEXT,
    "RoleID" INTEGER REFERENCES "UserRoles"("RoleID")
);

-- Создание таблицы типов оценок
CREATE TABLE IF NOT EXISTS "AssessmentTypes" (
    "TypeID" SERIAL PRIMARY KEY,
    "TypeName" VARCHAR(50) NOT NULL
);

-- Создание таблицы данных оценок
CREATE TABLE IF NOT EXISTS "AssessmentData" (
    "AssessmentID" SERIAL PRIMARY KEY,
    "UserID" INTEGER REFERENCES "Users"("UserID"),
    "TypeID" INTEGER REFERENCES "AssessmentTypes"("TypeID"),
    "ScoreValue" DECIMAL(5,2) NOT NULL,
    "Feedback" TEXT,
    "Timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы инструментов диагностики
CREATE TABLE IF NOT EXISTS "DiagnosticTools" (
    "ToolID" SERIAL PRIMARY KEY,
    "ToolName" VARCHAR(100) NOT NULL,
    "Description" TEXT
);

-- Создание таблицы диагностических данных
CREATE TABLE IF NOT EXISTS "DiagnosticData" (
    "DiagnosticID" SERIAL PRIMARY KEY,
    "UserID" INTEGER REFERENCES "Users"("UserID"),
    "ToolID" INTEGER REFERENCES "DiagnosticTools"("ToolID"),
    "CompetencyID" INTEGER REFERENCES "Competencies"("CompetencyID"),
    "ResultValue" DECIMAL(5,2) NOT NULL,
    "Timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы данных участия
CREATE TABLE IF NOT EXISTS "ParticipationData" (
    "ParticipationID" SERIAL PRIMARY KEY,
    "UserID" INTEGER REFERENCES "Users"("UserID"),
    "ActivityID" INTEGER REFERENCES "Activities"("ActivityID"),
    "Role" VARCHAR(100),
    "Contribution" TEXT,
    "Timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы данных процесса
CREATE TABLE IF NOT EXISTS "ProcessData" (
    "ProcessID" SERIAL PRIMARY KEY,
    "UserID" INTEGER REFERENCES "Users"("UserID"),
    "CourseID" INTEGER REFERENCES "Courses"("CourseID"),
    "ActionType" VARCHAR(50) NOT NULL,
    "Timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставка начальных данных
INSERT INTO "UserRoles" ("RoleName") VALUES 
('Студент'),
('Преподаватель'),
('Куратор'),
('Администратор'),
('Работодатель')
ON CONFLICT DO NOTHING;

INSERT INTO "Levels" ("Name", "Description") VALUES 
('Международный', 'Международный уровень достижений'),
('Всероссийский', 'Всероссийский уровень достижений'),
('Региональный', 'Региональный уровень достижений'),
('Университетский', 'Уровень университета')
ON CONFLICT DO NOTHING;

INSERT INTO "TypesOfAchievements" ("Name", "Description") VALUES 
('Учебная деятельность', 'Достижения в учебной деятельности'),
('Научная деятельность', 'Достижения в научной деятельности'),
('Культурно-творческая деятельность', 'Достижения в культурно-творческой деятельности'),
('Спортивная деятельность', 'Достижения в спортивной деятельности'),
('Общественная деятельность', 'Достижения в общественной деятельности')
ON CONFLICT DO NOTHING;

INSERT INTO "Achievements" ("Title", "Category", "Points", "Level_id", "Type_id") VALUES 
('Диплом бакалавра с отличием', 'Academic', 100, 4, 1),
('Победитель всероссийской олимпиады', 'Academic', 150, 2, 1),
('Публикация в научном журнале', 'Scientific', 80, 2, 2),
('Участие в международной конференции', 'Scientific', 60, 1, 2),
('Победитель творческого конкурса', 'Cultural', 70, 3, 3),
('Чемпион университета по спорту', 'Sports', 90, 4, 4),
('Староста группы', 'Social', 40, 4, 5)
ON CONFLICT DO NOTHING;

INSERT INTO "AssessmentTypes" ("TypeName") VALUES 
('Экзамен'),
('Зачет'),
('Курсовая работа'),
('Лабораторная работа'),
('Контрольная работа')
ON CONFLICT DO NOTHING;

INSERT INTO "DiagnosticTools" ("ToolName", "Description") VALUES 
('Тест профессиональных компетенций', 'Тестирование уровня профессиональных навыков'),
('Анкета самооценки', 'Самооценка студентом своих компетенций'),
('360-градусная обратная связь', 'Оценка компетенций от разных источников')
ON CONFLICT DO NOTHING;

INSERT INTO "Competencies" ("CompetencyName", "Description") VALUES 
('Коммуникативные навыки', 'Способность эффективно общаться'),
('Аналитическое мышление', 'Способность анализировать информацию'),
('Лидерство', 'Способность руководить командой'),
('Техническая экспертиза', 'Профессиональные технические знания')
ON CONFLICT DO NOTHING;

INSERT INTO "Courses" ("CourseName", "Duration", "Description") VALUES 
('Высшая математика', 16, 'Основы высшей математики для инженеров'),
('Физика', 12, 'Общий курс физики'),
('Информатика', 8, 'Основы программирования и информационных технологий'),
('Философия', 6, 'Курс философии и логики')
ON CONFLICT DO NOTHING;

INSERT INTO "Activities" ("ActivityName", "Description") VALUES 
('Научная конференция', 'Участие в научной конференции'),
('Спортивные соревнования', 'Участие в спортивных мероприятиях'),
('Творческий конкурс', 'Участие в творческих конкурсах'),
('Общественная работа', 'Участие в общественной деятельности')
ON CONFLICT DO NOTHING;