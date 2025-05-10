import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import {
  Map as MapIcon,
  Assignment as AssignmentIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Zone Monitoring',
      description:
        'Track environmental changes in specific zones with real-time sensor data and visual analytics.',
      icon: <MapIcon sx={{ fontSize: 40 }} />,
      path: '/zones',
    },
    {
      title: 'Climate Actions',
      description:
        'Create and manage actions to address climate change impacts in monitored zones.',
      icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
      path: '/actions',
    },
    {
      title: 'Analytics Dashboard',
      description:
        'View comprehensive analytics and metrics about climate change impacts and actions.',
      icon: <DashboardIcon sx={{ fontSize: 40 }} />,
      path: '/dashboard',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          Climate Change Monitor
        </Typography>
        <Typography variant="h5" color="text.secondary" align="center" paragraph>
          Track, analyze, and take action against climate change impacts
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {features.map((feature) => (
          <Grid item xs={12} md={4} key={feature.title}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 2,
                    color: 'primary.main',
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                  align="center"
                >
                  {feature.title}
                </Typography>
                <Typography align="center" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate(feature.path)}
                >
                  Explore
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Why Monitor Climate Change?
        </Typography>
        <Typography variant="body1" paragraph align="center">
          Climate change is one of the most pressing challenges of our time. By
          monitoring its impacts and taking coordinated action, we can work
          together to create a more sustainable future.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/zones')}
          >
            Get Started
          </Button>
        </Box>
      </Box>
    </Container>
  );
}; 