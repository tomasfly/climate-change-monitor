import { useState, useEffect } from 'react';
import { Zone, PaginatedResponse } from '../core/types';
import { apiService } from '../services/api';

interface UseZonesReturn {
  zones: Zone[];
  loading: boolean;
  error: Error | null;
  total: number;
  page: number;
  pageSize: number;
  fetchZones: (page?: number, pageSize?: number) => Promise<void>;
  createZone: (zone: Omit<Zone, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export function useZones(): UseZonesReturn {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchZones = async (newPage = page, newPageSize = pageSize) => {
    try {
      setLoading(true);
      setError(null);
      const response: PaginatedResponse<Zone> = await apiService.getZones(newPage, newPageSize);
      setZones(response.data);
      setTotal(response.total);
      setPage(response.page);
      setPageSize(response.pageSize);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch zones'));
    } finally {
      setLoading(false);
    }
  };

  const createZone = async (zone: Omit<Zone, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      setError(null);
      await apiService.createZone(zone);
      await fetchZones(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create zone'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []); // Empty dependency array means this runs once on mount

  return {
    zones,
    loading,
    error,
    total,
    page,
    pageSize,
    fetchZones,
    createZone,
  };
} 