import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
} from '@mui/material';
import { useQuery } from 'react-query';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ZoneMetrics {
  zoneId: string;
  zoneName: string;
  temperature: {
    current: number;
    trend: number;
  };
  waterQuality: {
    ph: number;
    turbidity: number;
  };
  wasteLevel: number;
}

interface ActionMetrics {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
}

export const Dashboard: React.FC = () => {
  const { data: zoneMetrics, isLoading: zonesLoading } = useQuery<ZoneMetrics[]>(
    'zoneMetrics',
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/zones/metrics`
      );
      return response.data;
    }
  );

  const { data: actionMetrics, isLoading: actionsLoading } = useQuery<ActionMetrics>(
    'actionMetrics',
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/actions/metrics`
      );
      return response.data;
    }
  );

  if (zonesLoading || actionsLoading) {
    return <Typography>Loading dashboard data...</Typography>;
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Action Progress */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Action Progress
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Completed Actions
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(actionMetrics?.completed / actionMetrics?.total) * 100}
                  sx={{ height: 10, borderRadius: 5 }}
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {actionMetrics?.completed} / {actionMetrics?.total} actions completed
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Zone Overview */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Zone Overview
              </Typography>
              <Grid container spacing={2}>
                {zoneMetrics?.map((zone) => (
                  <Grid item xs={12} md={4} key={zone.zoneId}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1">{zone.zoneName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Temperature: {zone.temperature.current}°C
                          {zone.temperature.trend > 0 ? ' ↑' : ' ↓'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Water Quality: pH {zone.waterQuality.ph}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Waste Level: {zone.wasteLevel}%
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Temperature Trends */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Temperature Trends
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={zoneMetrics?.map((zone) => ({
                      name: zone.zoneName,
                      temperature: zone.temperature.current,
                    }))}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}; 