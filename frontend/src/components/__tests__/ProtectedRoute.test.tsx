import React from 'react';
import { render, screen } from '../../utils/test-utils';
import { ProtectedRoute } from '../ProtectedRoute';
import { AuthProvider } from '../../contexts/AuthContext';
import { mockApiService } from '../../services/__mocks__/api';

// Mock the API service
jest.mock('../../services/api', () => ({
  apiService: mockApiService,
}));

describe('ProtectedRoute', () => {
  const TestComponent = () => <div>Protected Content</div>;

  it('renders children when user is authenticated', async () => {
    render(
      <AuthProvider>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </AuthProvider>
    );

    await screen.findByText('Protected Content');
  });

  it('redirects to login when user is not authenticated', async () => {
    // Mock no user
    mockApiService.getCurrentUser = jest.fn().mockRejectedValue(new Error('Not authenticated'));

    render(
      <AuthProvider>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </AuthProvider>
    );

    // Should redirect to login
    expect(window.location.pathname).toBe('/login');
  });

  it('redirects to unauthorized when user lacks required role', async () => {
    // Mock user with researcher role
    mockApiService.getCurrentUser = jest.fn().mockResolvedValue({
      data: {
        id: '1',
        email: 'test@example.com',
        role: 'researcher',
        name: 'Test User',
      },
      status: 200,
      message: 'Success',
    });

    render(
      <AuthProvider>
        <ProtectedRoute requiredRole="admin">
          <TestComponent />
        </ProtectedRoute>
      </AuthProvider>
    );

    // Should redirect to unauthorized
    expect(window.location.pathname).toBe('/unauthorized');
  });

  it('shows loading state while checking authentication', () => {
    // Mock slow response
    mockApiService.getCurrentUser = jest.fn().mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(
      <AuthProvider>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </AuthProvider>
    );

    // Should show loading indicator
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
}); 