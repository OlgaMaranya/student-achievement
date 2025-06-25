// Клиент для работы с PHP API системы ИрГУПС
const PHP_API_BASE_URL = 'http://localhost:8080';

export class PhpApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = PHP_API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('PHP API request failed:', error);
      throw error;
    }
  }

  // Методы для работы с пользователями
  async getUser(id: number) {
    return this.request(`/users/${id}`);
  }

  async updateUser(id: number, userData: any) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Методы для работы с достижениями
  async getUserAchievements(userId: number) {
    return this.request(`/users/${userId}/achievements`);
  }

  async createUserAchievement(userId: number, achievementData: any) {
    return this.request(`/users/${userId}/achievements`, {
      method: 'POST',
      body: JSON.stringify(achievementData),
    });
  }

  async deleteUserAchievement(achievementId: number) {
    return this.request(`/achievements/${achievementId}`, {
      method: 'DELETE',
    });
  }

  async getAllAchievements() {
    return this.request('/achievements');
  }

  // Методы для работы с справочниками
  async getLevels() {
    return this.request('/levels');
  }

  async getTypesOfAchievements() {
    return this.request('/types');
  }

  async getActivities() {
    return this.request('/activities');
  }

  async getCourses() {
    return this.request('/courses');
  }

  async getCompetencies() {
    return this.request('/competencies');
  }

  async getProjects() {
    return this.request('/projects');
  }

  // Методы для работы с KPI
  async getUserKPI(userId: number) {
    return this.request(`/users/${userId}/kpi`);
  }

  async updateUserKPI(userId: number, kpiData: any) {
    return this.request(`/users/${userId}/kpi`, {
      method: 'PUT',
      body: JSON.stringify(kpiData),
    });
  }

  // Методы для работы с образовательными данными
  async getUserCourses(userId: number) {
    return this.request(`/users/${userId}/courses`);
  }

  async getAssessmentData(userId: number) {
    return this.request(`/users/${userId}/assessments`);
  }

  async getDiagnosticData(userId: number) {
    return this.request(`/users/${userId}/diagnostics`);
  }

  async getUserProjects(userId: number) {
    return this.request(`/users/${userId}/projects`);
  }

  async getParticipationData(userId: number) {
    return this.request(`/users/${userId}/participation`);
  }

  // Тестовый метод для проверки работы API
  async testConnection() {
    return this.request('/test.php');
  }
}

// Экспорт экземпляра клиента
export const phpApiClient = new PhpApiClient();