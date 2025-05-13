export interface Zone {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  ecosystemType: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface MonitoringData {
  id: string;
  zoneId: string;
  timestamp: string;
  temperature: number;
  humidity: number;
  airQuality: number;
  biodiversityIndex: number;
  waterQuality: number;
  soilHealth: number;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'scientist' | 'researcher';
  name: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
} 