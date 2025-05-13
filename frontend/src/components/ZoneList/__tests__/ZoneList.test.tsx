import React from 'react';
import { render, screen, waitFor } from '../../utils/test-utils';
import { ZoneList } from '../ZoneList';
import { mockApiService } from '../../../services/__mocks__/api';

// Mock the API service
jest.mock('../../../services/api', () => ({
  apiService: mockApiService,
}));

describe('ZoneList', () => {
  it('renders zone list correctly', async () => {
    render(<ZoneList />);

    // Wait for the zones to be loaded
    await waitFor(() => {
      expect(screen.getByText('Test Zone 1')).toBeInTheDocument();
    });

    // Check if the zone details are displayed
    expect(screen.getByText('Forest')).toBeInTheDocument();
    expect(screen.getByText('active')).toBeInTheDocument();
  });

  it('handles empty zone list', async () => {
    // Override mock data with empty array
    mockApiService.getZones = jest.fn().mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      pageSize: 10,
    });

    render(<ZoneList />);

    await waitFor(() => {
      expect(screen.getByText('No zones found')).toBeInTheDocument();
    });
  });

  it('handles error state', async () => {
    // Mock API error
    mockApiService.getZones = jest.fn().mockRejectedValue(new Error('Failed to fetch zones'));

    render(<ZoneList />);

    await waitFor(() => {
      expect(screen.getByText('Error loading zones')).toBeInTheDocument();
    });
  });
}); 