import { ApiResponse, PaginatedResponse, Zone, MonitoringData, User } from '../../core/types';

export class MockApiService {
  private mockZones: Zone[] = [
    {
      id: '1',
      name: 'Test Zone 1',
      location: { latitude: 40.7128, longitude: -74.0060 },
      ecosystemType: 'Forest',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  private mockMonitoringData: MonitoringData[] = [
    {
      id: '1',
      zoneId: '1',
      timestamp: new Date().toISOString(),
      temperature: 25.5,
      humidity: 65,
      airQuality: 85,
      biodiversityIndex: 0.8,
      waterQuality: 90,
      soilHealth: 75,
    },
  ];

  private mockUser: User = {
    id: '1',
    email: 'test@example.com',
    role: 'scientist',
    name: 'Test User',
  };

  async getZones(page = 1, pageSize = 10): Promise<PaginatedResponse<Zone>> {
    return {
      data: this.mockZones,
      total: this.mockZones.length,
      page,
      pageSize,
    };
  }

  async getZone(id: string): Promise<ApiResponse<Zone>> {
    const zone = this.mockZones.find(z => z.id === id);
    if (!zone) {
      throw new Error('Zone not found');
    }
    return {
      data: zone,
      status: 200,
      message: 'Success',
    };
  }

  async createZone(zone: Omit<Zone, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Zone>> {
    const newZone: Zone = {
      ...zone,
      id: String(this.mockZones.length + 1),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.mockZones.push(newZone);
    return {
      data: newZone,
      status: 201,
      message: 'Zone created successfully',
    };
  }

  async getMonitoringData(zoneId: string, page = 1, pageSize = 10): Promise<PaginatedResponse<MonitoringData>> {
    const data = this.mockMonitoringData.filter(d => d.zoneId === zoneId);
    return {
      data,
      total: data.length,
      page,
      pageSize,
    };
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return {
      data: this.mockUser,
      status: 200,
      message: 'Success',
    };
  }
}

export const mockApiService = new MockApiService(); 