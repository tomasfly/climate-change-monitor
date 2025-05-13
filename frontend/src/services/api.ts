import axios, { AxiosInstance } from 'axios';
import { ApiResponse, PaginatedResponse, Zone, MonitoringData, User } from '../core/types';

export class ApiService {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Zone endpoints
  async getZones(page = 1, pageSize = 10): Promise<PaginatedResponse<Zone>> {
    const response = await this.client.get(`/zones?page=${page}&pageSize=${pageSize}`);
    return response.data;
  }

  async getZone(id: string): Promise<ApiResponse<Zone>> {
    const response = await this.client.get(`/zones/${id}`);
    return response.data;
  }

  async createZone(zone: Omit<Zone, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Zone>> {
    const response = await this.client.post('/zones', zone);
    return response.data;
  }

  // Monitoring data endpoints
  async getMonitoringData(zoneId: string, page = 1, pageSize = 10): Promise<PaginatedResponse<MonitoringData>> {
    const response = await this.client.get(`/monitoring/${zoneId}?page=${page}&pageSize=${pageSize}`);
    return response.data;
  }

  // User endpoints
  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await this.client.get('/users/me');
    return response.data;
  }
}

// Create a singleton instance
export const apiService = new ApiService(process.env.REACT_APP_API_URL || 'http://localhost:3000/api'); 