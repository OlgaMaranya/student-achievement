-- Adminer 4.8.1 MySQL 8.0.42-0ubuntu0.20.04.1 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `Achievements`;
CREATE TABLE `Achievements` (
  `ID_achievement` int NOT NULL COMMENT 'Уникальный идентификатор достижения.',
  `Title` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'Название достижения (например, "Победитель всероссийской олимпиады").',
  `Category` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'Категория достижения (учебная, научная, культурно-творческая и т.д.).',
  `Points` int NOT NULL COMMENT 'Количество баллов, начисляемых за достижение.',
  `Validity_period` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL COMMENT 'Срок действия достижения (например, "1 год", "Бессрочно").',
  `Control_body` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL COMMENT 'Организация или лицо, ответственное за подтверждение достижения (например, "Деканат", "УНИР").',
  `Level_id` int NOT NULL COMMENT 'Идентификатор уровня достижения (связан с таблицей Levels).',
  `Type_id` int NOT NULL COMMENT 'Идентификатор типа достижения (связан с таблицей TypesOfAchievements).',
  PRIMARY KEY (`ID_achievement`),
  KEY `Level_id` (`Level_id`),
  KEY `Type_id` (`Type_id`),
  CONSTRAINT `Achievements_ibfk_1` FOREIGN KEY (`Level_id`) REFERENCES `Levels` (`ID_level`),
  CONSTRAINT `Achievements_ibfk_2` FOREIGN KEY (`Type_id`) REFERENCES `TypesOfAchievements` (`ID_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Таблица достижений, содержащая информацию о типах достижений, баллах, сроках действия и контролирующих органах.';


DROP TABLE IF EXISTS `Activities`;
CREATE TABLE `Activities` (
  `ActivityID` int NOT NULL COMMENT 'Уникальный идентификатор активности.',
  `ActivityName` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'Наименование активности.',
  `Description` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL COMMENT 'Описание активности.',
  PRIMARY KEY (`ActivityID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Таблица активностей, в которых могут участвовать пользователи (проекты, конференции).';


DROP TABLE IF EXISTS `ActivityDescriptions`;
CREATE TABLE `ActivityDescriptions` (
  `ActivityID` int NOT NULL COMMENT 'Уникальный идентификатор активности.',
  `ActivityName` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'Название активности (например, "Всероссийская научная конференция").',
  `Description` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL COMMENT 'Описание активности.',
  `StartDate` date DEFAULT NULL COMMENT 'Дата начала активности.',
  `EndDate` date DEFAULT NULL COMMENT 'Дата окончания активности.',
  `LevelID` int DEFAULT NULL COMMENT 'Идентификатор уровня активности (связан с таблицей Levels).',
  `TypeID` int DEFAULT NULL COMMENT 'Идентификатор типа активности (связан с таблицей TypesOfAchievements).',
  PRIMARY KEY (`ActivityID`),
  KEY `LevelID` (`LevelID`),
  KEY `TypeID` (`TypeID`),
  CONSTRAINT `ActivityDescriptions_ibfk_1` FOREIGN KEY (`LevelID`) REFERENCES `Levels` (`ID_level`),
  CONSTRAINT `ActivityDescriptions_ibfk_2` FOREIGN KEY (`TypeID`) REFERENCES `TypesOfAchievements` (`ID_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Таблица описаний активностей, таких как проекты, конференции, соревнования и т.д.';


DROP TABLE IF EXISTS `AssessmentData`;
CREATE TABLE `AssessmentData` (
  `AssessmentID` int NOT NULL COMMENT 'Уникальный идентификатор записи оценки.',
  `UserID` int NOT NULL COMMENT 'Идентификатор пользователя (связан с таблицей Users).',
  `TypeID` int NOT NULL COMMENT 'Идентификатор типа оценки (связан с таблицей AssessmentTypes).',
  `ScoreValue` float NOT NULL COMMENT 'Балл или оценка за выполненную работу.',
  `Feedback` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL COMMENT 'Комментарий к оценке.',
  `Timestamp` datetime NOT NULL COMMENT 'Время выставления оценки.',
  PRIMARY KEY (`AssessmentID`),
  KEY `UserID` (`UserID`),
  KEY `TypeID` (`TypeID`),
  CONSTRAINT `AssessmentData_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`),
  CONSTRAINT `AssessmentData_ibfk_2` FOREIGN KEY (`TypeID`) REFERENCES `AssessmentTypes` (`TypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Таблица данных об оценках пользователей за выполненные задания.';


DROP TABLE IF EXISTS `AssessmentTypes`;
CREATE TABLE `AssessmentTypes` (
  `TypeID` int NOT NULL COMMENT 'Уникальный идентификатор типа оценки.',
  `TypeName` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'Наименование типа оценки.',
  PRIMARY KEY (`TypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Таблица типов оценок (например, экзамен, контрольная работа).';


DROP TABLE IF EXISTS `Competencies`;
CREATE TABLE `Competencies` (
  `CompetencyID` int NOT NULL COMMENT 'Уникальный идентификатор компетенции.',
  `CompetencyName` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'Наименование компетенции.',
  `Description` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL COMMENT 'Описание компетенции.',
  PRIMARY KEY (`CompetencyID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Таблица компетенций, которые оцениваются в процессе диагностики.';


DROP TABLE IF EXISTS `Courses`;
CREATE TABLE `Courses` (
  `CourseID` int NOT NULL COMMENT 'Уникальный идентификатор курса.',
  `CourseName` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'Наименование курса.',
  `Duration` int NOT NULL COMMENT 'Продолжительность курса в неделях.',
  `Description` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL COMMENT 'Описание содержания курса.',
  PRIMARY KEY (`CourseID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Таблица образовательных курсов университета.';


DROP TABLE IF EXISTS `CuratorActions`;
CREATE TABLE `CuratorActions` (
  `ActionID` int NOT NULL COMMENT 'Уникальный идентификатор действия.',
  `CuratorID` int NOT NULL COMMENT 'Идентификатор куратора (связан с таблицей Users).',
  `UserID` int NOT NULL COMMENT 'Идентификатор студента (связан с таблицей Users).',
  `ActionType` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'Тип действия (например, "Корректировка траектории", "Отправка уведомления").',
  `Timestamp` datetime NOT NULL COMMENT 'Время действия.',
  PRIMARY KEY (`ActionID`),
  KEY `CuratorID` (`CuratorID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `CuratorActions_ibfk_1` FOREIGN KEY (`CuratorID`) REFERENCES `Users` (`UserID`),
  CONSTRAINT `CuratorActions_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Таблица действий кураторов по управлению траекториями студентов.';


DROP TABLE IF EXISTS `DiagnosticData`;
CREATE TABLE `DiagnosticData` (
  `DiagnosticID` int NOT NULL COMMENT 'Уникальный идентификатор записи диагностики.',
  `UserID` int NOT NULL COMMENT 'Идентификатор пользователя (связан с таблицей Users).',
  `ToolID` int NOT NULL COMMENT 'Идентификатор diagnostic tool (связан с таблицей DiagnosticTools).',
  `CompetencyID` int NOT NULL COMMENT 'Идентификатор компетенции (связан с таблицей Competencies).',
  `ResultValue` float NOT NULL COMMENT 'Значение результата диагностики (например, балл или оценка).',
  `Timestamp` datetime NOT NULL COMMENT 'Время проведения диагностического исследования.',
  PRIMARY KEY (`DiagnosticID`),
  KEY `UserID` (`UserID`),
  KEY `ToolID` (`ToolID`),
  KEY `CompetencyID` (`CompetencyID`),
  CONSTRAINT `DiagnosticData_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`),
  CONSTRAINT `DiagnosticData_ibfk_2` FOREIGN KEY (`ToolID`) REFERENCES `DiagnosticTools` (`ToolID`),
  CONSTRAINT `DiagnosticData_ibfk_3` FOREIGN KEY (`CompetencyID`) REFERENCES `Competencies` (`CompetencyID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Таблица результатов диагностических исследований компетенций пользователей.';


DROP TABLE IF EXISTS `DiagnosticTools`;
CREATE TABLE `DiagnosticTools` (
  `ToolID` int NOT NULL COMMENT 'Уникальный идентификатор diagnostic tool.',
  `ToolName` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'Наименование diagnostic tool.',
  `Description` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL COMMENT 'Описание инструмента диагностики.',
  PRIMARY KEY (`ToolID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Таблица diagnostic tools (методики диагностики компетенций и навыков).';


DROP TABLE IF EXISTS `EducationalContent`;
CREATE TABLE `EducationalContent` (
  `ContentID` int NOT NULL COMMENT 'Уникальный идентификатор контента.',
  `CourseID` int NOT NULL COMMENT 'Идентификатор курса (связан с таблицей Courses).',
  `ModuleID` int NOT NULL COMMENT 'Идентификатор модуля (связан с таблицей Modules).',
  `Title` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'Наименование материала.',
  `Description` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL COMMENT 'Описание материала.',
  `CreationDate` datetime NOT NULL COMMENT 'Дата создания материала.',
  PRIMARY KEY (`ContentID`),
  KEY `CourseID` (`CourseID`),
  KEY `ModuleID` (`ModuleID`),
  CONSTRAINT `EducationalContent_ibfk_1` FOREIGN KEY (`CourseID`) REFERENCES `Courses` (`CourseID`),
  CONSTRAINT `EducationalContent_ibfk_2` FOREIGN KEY (`ModuleID`) REFERENCES `Modules` (`ModuleID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Таблица образовательного контента (материалы, лекции, задания).';


DROP TABLE IF EXISTS `Employers`;
CREATE TABLE `Employers` (
  `EmployerID` int NOT NULL COMMENT 'Уникальный идентификатор работодателя.',
  `CompanyName` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'Название компании-работодателя.',
  `ContactInfo` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL COMMENT 'Контактная информация компании.',
  `RoleID` int NOT NULL COMMENT 'Роль работодателя (связана с таблицей UserRoles).',
  PRIMARY KEY (`EmployerID`),
  KEY `RoleID` (`RoleID`),
  CONSTRAINT `Employers_ibfk_1` FOREIGN KEY (`RoleID`) REFERENCES `UserRoles` (`RoleID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Таблица работодателей, которые взаимодействуют с системой через приглашения на стажировки и проекты.';


DROP TABLE IF EXISTS `ExperienceData`;
CREATE TABLE `ExperienceData` (
  `ExperienceID` int NOT NULL COMMENT 'Уникальный идентификатор записи опыта.',
  `UserID` int NOT NULL COMMENT 'Идентификатор пользователя (связан с таблицей Users).',
  `ActivityID` int NOT NULL COMMENT 'Идентификатор активности (связан с таблицей Activities).',
  `Goal` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL COMMENT 'Цель участия в активности.',
  `Task` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL COMMENT 'Задачи, поставленные перед пользователем.',
  `Criteria` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL COMMENT 'Критерии оценки результата.',
  `Outcome` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL COMMENT 'Результат участия в активности.',
  `Timestamp` datetime NOT NULL COMMENT 'Время завершения активности.',
  PRIMARY KEY (`ExperienceID`),
  KEY `UserID` (`UserID`),
  KEY `ActivityID` (`ActivityID`),
  CONSTRAINT `ExperienceData_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`),
  CONSTRAINT `ExperienceData_ibfk_2` FOREIGN KEY (`ActivityID`) REFERENCES `Activities` (`ActivityID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Таблица данных об образовательном опыте пользователей.';


DROP TABLE IF EXISTS `Intentions`;
CREATE TABLE `Intentions` (
  `IntentionID` int NOT NULL COMMENT 'Уникальный идентификатор намерения.',
  `UserID` int NOT NULL COMMENT 'Идентификатор пользователя (связан с таблицей Users).',
  `CategoryID` int NOT NULL COMMENT 'Идентификатор категории намерения (связан с таблицей PreferenceCategories).',
  `Source` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'Источник намерения (например, "Студент", "Куратор", "Работодатель").',
  `Description` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'Описание намерения или рекомендации.',
  `Timestamp` datetime NOT NULL COMMENT 'Время создания намерения.',
  PRIMARY KEY (`IntentionID`),
  KEY `UserID` (`UserID`),
  KEY `CategoryID` (`CategoryID`),
  CONSTRAINT `Intentions_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`),
  CONSTRAINT `Intentions_ibfk_2` FOREIGN KEY (`CategoryID`) REFERENCES `PreferenceCategories` (`CategoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Таблица намерений и рекомендаций для пользователей системы.';


DROP TABLE IF EXISTS `Interactions`;
CREATE TABLE `Interactions` (
  `InteractionID` int NOT NULL COMMENT 'Уникальный идентификатор взаимодействия.',
  `UserID` int NOT NULL COMMENT 'Идентификатор пользователя (связан с таблицей Users).',
  `ContentID` int NOT NULL COMMENT 'Идентификатор контента (связан с таблицей EducationalContent).',
  `ActionType` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'Тип взаимодействия (например, "Просмотр", "Комментарий").',
  `Timestamp` datetime NOT NULL COMMENT 'Время взаимодействия.',
  PRIMARY KEY (`InteractionID`),
  KEY `UserID` (`UserID`),
  KEY `ContentID` (`ContentID`),
  CONSTRAINT `Interactions_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`),
  CONSTRAINT `Interactions_ibfk_2` FOREIGN KEY (`ContentID`) REFERENCES `EducationalContent` (`ContentID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Таблица взаимодействий пользователей с образовательным контентом.';


DROP TABLE IF EXISTS `KPI`;
CREATE TABLE `KPI` (
  `ID_kpi` int NOT NULL COMMENT 'Уникальный идентификатор записи KPI.',
  `FK_user_id` int NOT NULL COMMENT 'Идентификатор пользователя (связан с таблицей Users).',
  `Total_points` int NOT NULL COMMENT 'Общий рейтинг пользователя, рассчитываемый как сумма всех баллов за достижения.',
  `Semester_rating` int NOT NULL COMMENT 'Рейтинг пользователя за текущий семестр.',
  `Academic_rating` int NOT NULL COMMENT 'Рейтинг пользователя по учебной деятельности.',
  `Scientific_rating` int NOT NULL COMMENT 'Рейтинг пользователя по научной деятельности.',
  `Cultural_rating` int NOT NULL COMMENT 'Рейтинг пользователя по культурно-творческой деятельности.',
  `Sports_rating` int NOT NULL COMMENT 'Рейтинг пользователя по спортивной деятельности.',
  `Social_rating` int NOT NULL COMMENT 'Рейтинг пользователя по общественной деятельности.',
  `Valid_from` date NOT NULL COMMENT 'Дата начала действия KPI.',
  `Valid_to` date DEFAULT NULL COMMENT 'Дата окончания действия KPI (может быть NULL для бессрочных записей).',
  PRIMARY KEY (`ID_kpi`),
  KEY `FK_user_id` (`FK_user_id`),
  CONSTRAINT `KPI_ibfk_1` FOREIGN KEY (`FK_user_id`) REFERENCES `Users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Таблица ключевых показателей эффективности (KPI), содержащая агрегированные данные о рейтингах пользователей.';


DROP TABLE IF EXISTS `Levels`;
CREATE TABLE `Levels` (
  `ID_level` int NOT NULL COMMENT 'Уникальный идентификатор уровня достижения.',
  `Name` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'Наименование уровня достижения (например, "международный", "всероссийский").',
  PRIMARY KEY (`ID_level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Таблица уровней достижений, таких как международный, всероссийский, региональный и т.д.';


DROP TABLE IF EXISTS `Modules`;
CREATE TABLE `Modules` (
  `ModuleID` int NOT NULL COMMENT 'Уникальный идентификатор модуля.',
  `ModuleName` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'Наименование модуля.',
  `CourseID` int NOT NULL COMMENT 'Идентификатор курса (связан с таблицей Courses).',
  PRIMARY KEY (`ModuleID`),
  KEY `CourseID` (`CourseID`),
  CONSTRAINT `Modules_ibfk_1` FOREIGN KEY (`CourseID`) REFERENCES `Courses` (`CourseID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Таблица модулей, входящих в состав курсов.';


DROP TABLE IF EXISTS `ParticipationData`;
CREATE TABLE `ParticipationData` (
  `ParticipationID` int NOT NULL COMMENT 'Уникальный идентификатор записи участия.',
  `UserID` int NOT NULL COMMENT 'Идентификатор пользователя (связан с таблицей Users).',
  `ActivityID` int NOT NULL COMMENT 'Идентификатор активности (связан с таблицей Activities).',
  `Role` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'Роль пользователя в активности (например, "Участник", "Организатор").',
  `Contribution` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL COMMENT 'Вклад пользователя в активность.',
  `EmployerID` int DEFAULT NULL COMMENT 'Идентификатор работодателя, если активность организована им.',
  `Timestamp` datetime NOT NULL COMMENT 'Время участия в активности.',
  PRIMARY KEY (`ParticipationID`),
  KEY `UserID` (`UserID`),
  KEY `ActivityID` (`ActivityID`),
  KEY `EmployerID` (`EmployerID`),
  CONSTRAINT `ParticipationData_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`),
  CONSTRAINT `ParticipationData_ibfk_2` FOREIGN KEY (`ActivityID`) REFERENCES `Activities` (`ActivityID`),
  CONSTRAINT `ParticipationData_ibfk_3` FOREIGN KEY (`EmployerID`) REFERENCES `Employers` (`EmployerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Таблица данных о участии пользователей в различных активностях.';


DROP TABLE IF EXISTS `PartnerRequests`;
CREATE TABLE `PartnerRequests` (
  `RequestID` int NOT NULL COMMENT 'Уникальный идентификатор запроса.',
  `PartnerID` int NOT NULL COMMENT 'Идентификатор партнера (связан с таблицей Employers).',
  `Competencies` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'Требуемые компетенции для запроса.',
  `Deadline` datetime NOT NULL COMMENT 'Срок реализации запроса.',
  `Status` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'Статус запроса (например, "В работе", "Завершено").',
  `Timestamp` datetime NOT NULL COMMENT 'Время создания запроса.',
  PRIMARY KEY (`RequestID`),
  KEY `PartnerID` (`PartnerID`),
  CONSTRAINT `PartnerRequests_ibfk_1` FOREIGN KEY (`PartnerID`) REFERENCES `Employers` (`EmployerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Таблица запросов от партнеров universities (работодателей) для подготовки специалистов.';


DROP TABLE IF EXISTS `PreferenceCategories`;
CREATE TABLE `PreferenceCategories` (
  `CategoryID` int NOT NULL COMMENT 'Уникальный идентификатор категории намерений.',
  `CategoryName` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'Наименование категории намерений.',
  PRIMARY KEY (`CategoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Таблица категорий намерений (например, выбор курса, участие в проекте).';


DROP TABLE IF EXISTS `ProcessData`;
CREATE TABLE `ProcessData` (
  `ProcessID` int NOT NULL COMMENT 'Уникальный идентификатор события.',
  `UserID` int NOT NULL COMMENT 'Идентификатор пользователя (связан с таблицей Users).',
  `CourseID` int NOT NULL COMMENT 'Идентификатор курса (связан с таблицей Courses).',
  `ActionType` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'Тип действия (например, "Посещение", "Отправка работы").',
  `Timestamp` datetime NOT NULL COMMENT 'Время действия.',
  PRIMARY KEY (`ProcessID`),
  KEY `UserID` (`UserID`),
  KEY `CourseID` (`CourseID`),
  CONSTRAINT `ProcessData_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`),
  CONSTRAINT `ProcessData_ibfk_2` FOREIGN KEY (`CourseID`) REFERENCES `Courses` (`CourseID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Таблица данных об образовательном процессе (посещения, выполненные действия).';


DROP TABLE IF EXISTS `Projects`;
CREATE TABLE `Projects` (
  `ProjectID` int NOT NULL COMMENT 'Уникальный идентификатор проекта.',
  `Title` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'Наименование проекта.',
  `Description` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL COMMENT 'Описание проекта.',
  `PartnerID` int NOT NULL COMMENT 'Идентификатор партнера (связан с таблицей Employers).',
  `StartDate` datetime NOT NULL COMMENT 'Дата начала проекта.',
  `EndDate` datetime NOT NULL COMMENT 'Дата окончания проекта.',
  `Status` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'Статус проекта (например, "Активный", "Завершен").',
  PRIMARY KEY (`ProjectID`),
  KEY `PartnerID` (`PartnerID`),
  CONSTRAINT `Projects_ibfk_1` FOREIGN KEY (`PartnerID`) REFERENCES `Employers` (`EmployerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Таблица проектов, предлагаемых партнерами или университетом.';


DROP TABLE IF EXISTS `StateCategories`;
CREATE TABLE `StateCategories` (
  `CategoryID` int NOT NULL COMMENT 'Уникальный идентификатор категории состояния.',
  `CategoryName` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'Наименование категории состояния.',
  PRIMARY KEY (`CategoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Таблица категорий состояний (физическое, эмоциональное, когнитивное).';


DROP TABLE IF EXISTS `StateData`;
CREATE TABLE `StateData` (
  `StateID` int NOT NULL COMMENT 'Уникальный идентификатор записи состояния.',
  `UserID` int NOT NULL COMMENT 'Идентификатор пользователя (связан с таблицей Users).',
  `CategoryID` int NOT NULL COMMENT 'Идентификатор категории состояния (связан с таблицей StateCategories).',
  `MeasurementValue` float NOT NULL COMMENT 'Значение измеренного показателя.',
  `Timestamp` datetime NOT NULL COMMENT 'Время измерения состояния.',
  PRIMARY KEY (`StateID`),
  KEY `UserID` (`UserID`),
  KEY `CategoryID` (`CategoryID`),
  CONSTRAINT `StateData_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`),
  CONSTRAINT `StateData_ibfk_2` FOREIGN KEY (`CategoryID`) REFERENCES `StateCategories` (`CategoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Таблица данных о состоянии пользователей (стресс, концентрация).';


DROP TABLE IF EXISTS `TypesOfAchievements`;
CREATE TABLE `TypesOfAchievements` (
  `ID_type` int NOT NULL COMMENT 'Уникальный идентификатор типа достижения.',
  `Name` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'Наименование типа достижения (например, "участие", "победитель").',
  PRIMARY KEY (`ID_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Таблица типов достижений, таких как "участие", "победитель", "призер" и т.д.';


DROP TABLE IF EXISTS `UserAchievements`;
CREATE TABLE `UserAchievements` (
  `ID_user_achievement` int NOT NULL COMMENT 'Уникальный идентификатор записи достижения пользователя.',
  `FK_user_id` int NOT NULL COMMENT 'Идентификатор пользователя (связан с таблицей Users).',
  `FK_achievement_id` int NOT NULL COMMENT 'Идентификатор достижения (связан с таблицей Achievements).',
  `Date_received` date NOT NULL COMMENT 'Дата получения достижения.',
  `Document_confirmation` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL COMMENT 'Подтверждающий документ (например, путь к файлу или описание документа).',
  PRIMARY KEY (`ID_user_achievement`),
  KEY `FK_user_id` (`FK_user_id`),
  KEY `FK_achievement_id` (`FK_achievement_id`),
  CONSTRAINT `UserAchievements_ibfk_1` FOREIGN KEY (`FK_user_id`) REFERENCES `Users` (`UserID`),
  CONSTRAINT `UserAchievements_ibfk_2` FOREIGN KEY (`FK_achievement_id`) REFERENCES `Achievements` (`ID_achievement`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Таблица достижений пользователей, связывающая конкретного пользователя с его достижениями.';


DROP TABLE IF EXISTS `UserDataRelations`;
CREATE TABLE `UserDataRelations` (
  `RelationID` int NOT NULL COMMENT 'Уникальный идентификатор связи.',
  `UserID` int NOT NULL COMMENT 'Идентификатор пользователя (связан с таблицей Users).',
  `DiagnosticID` int DEFAULT NULL COMMENT 'Идентификатор записи диагностики (связан с таблицей DiagnosticData).',
  `ProcessID` int DEFAULT NULL COMMENT 'Идентификатор события образовательного процесса (связан с таблицей ProcessData).',
  `AssessmentID` int DEFAULT NULL COMMENT 'Идентификатор записи оценки (связан с таблицей AssessmentData).',
  `IntentionID` int DEFAULT NULL COMMENT 'Идентификатор намерения (связан с таблицей Intentions).',
  `ParticipationID` int DEFAULT NULL COMMENT 'Идентификатор записи участия (связан с таблицей ParticipationData).',
  PRIMARY KEY (`RelationID`),
  KEY `UserID` (`UserID`),
  KEY `DiagnosticID` (`DiagnosticID`),
  KEY `ProcessID` (`ProcessID`),
  KEY `AssessmentID` (`AssessmentID`),
  KEY `IntentionID` (`IntentionID`),
  KEY `ParticipationID` (`ParticipationID`),
  CONSTRAINT `UserDataRelations_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`),
  CONSTRAINT `UserDataRelations_ibfk_2` FOREIGN KEY (`DiagnosticID`) REFERENCES `DiagnosticData` (`DiagnosticID`),
  CONSTRAINT `UserDataRelations_ibfk_3` FOREIGN KEY (`ProcessID`) REFERENCES `ProcessData` (`ProcessID`),
  CONSTRAINT `UserDataRelations_ibfk_4` FOREIGN KEY (`AssessmentID`) REFERENCES `AssessmentData` (`AssessmentID`),
  CONSTRAINT `UserDataRelations_ibfk_5` FOREIGN KEY (`IntentionID`) REFERENCES `Intentions` (`IntentionID`),
  CONSTRAINT `UserDataRelations_ibfk_6` FOREIGN KEY (`ParticipationID`) REFERENCES `ParticipationData` (`ParticipationID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Таблица связей между данными всех модулей для конкретного пользователя.';


DROP TABLE IF EXISTS `UserRoles`;
CREATE TABLE `UserRoles` (
  `RoleID` int NOT NULL COMMENT 'Уникальный идентификатор роли.',
  `RoleName` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'Наименование роли пользователя.',
  PRIMARY KEY (`RoleID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Таблица ролей пользователей системы (студент, преподаватель, куратор, работодатель).';


DROP TABLE IF EXISTS `Users`;
CREATE TABLE `Users` (
  `UserID` int NOT NULL COMMENT 'Уникальный идентификатор пользователя.',
  `FirstName` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'Имя пользователя.',
  `LastName` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'Фамилия пользователя.',
  `Email` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'Электронная почта пользователя (уникальна для каждого пользователя).',
  `PasswordHash` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'Хеш пароля пользователя.',
  `RoleID` int NOT NULL COMMENT 'Идентификатор роли пользователя (связан с таблицей UserRoles).',
  `RegistrationDate` datetime NOT NULL COMMENT 'Дата регистрации пользователя в системе.',
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Email` (`Email`),
  KEY `RoleID` (`RoleID`),
  CONSTRAINT `Users_ibfk_1` FOREIGN KEY (`RoleID`) REFERENCES `UserRoles` (`RoleID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Таблица пользователей системы, включая студентов, преподавателей, кураторов и работодателей.';


-- 2025-06-16 06:14:16
