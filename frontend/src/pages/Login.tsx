import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import { useMsal } from '@azure/msal-react';

export const Login: React.FC = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogin = async () => {
    try {
      await instance.loginPopup();
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: theme.spacing(4),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5" gutterBottom>
            Climate Change Monitor
          </Typography>
          <Typography variant="body1" align="center" gutterBottom>
            Sign in to access the climate monitoring platform
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
            sx={{ mt: 3 }}
          >
            Sign in with Microsoft
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}; 