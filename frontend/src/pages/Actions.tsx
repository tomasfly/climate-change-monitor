import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

interface Action {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  impactMetrics: {
    before: Record<string, number>;
    after: Record<string, number>;
  };
  zone: {
    id: string;
    name: string;
  };
  assignedTo: {
    id: string;
    name: string;
  };
  startDate: string;
  endDate: string;
}

interface Zone {
  id: string;
  name: string;
}

export const Actions: React.FC = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: actions, isLoading: actionsLoading } = useQuery<Action[]>(
    'actions',
    async () => {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/actions`);
      return response.data;
    }
  );

  const { data: zones, isLoading: zonesLoading } = useQuery<Zone[]>(
    'zones',
    async () => {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/zones`);
      return response.data;
    }
  );

  const createAction = useMutation(
    async (newAction: Omit<Action, 'id'>) => {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/actions`,
        newAction
      );
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('actions');
        setOpen(false);
      },
    }
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newAction = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      status: 'pending',
      impactMetrics: {
        before: {},
        after: {},
      },
      zone: {
        id: formData.get('zoneId') as string,
      },
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
    };
    createAction.mutate(newAction);
  };

  if (actionsLoading || zonesLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Climate Actions
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpen(true)}
              >
                Add New Action
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {actions?.map((action) => (
          <Grid item xs={12} md={6} key={action.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{action.title}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {action.description}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Chip
                    label={action.status}
                    color={
                      action.status === 'completed'
                        ? 'success'
                        : action.status === 'in_progress'
                        ? 'primary'
                        : 'default'
                    }
                    size="small"
                  />
                </Box>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Zone: {action.zone.name}
                </Typography>
                <Typography variant="body2">
                  Timeline: {new Date(action.startDate).toLocaleDateString()} -{' '}
                  {new Date(action.endDate).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Action</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="title"
              label="Action Title"
              type="text"
              fullWidth
              required
            />
            <TextField
              margin="dense"
              name="description"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={4}
              required
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Zone</InputLabel>
              <Select name="zoneId" label="Zone" required>
                {zones?.map((zone) => (
                  <MenuItem key={zone.id} value={zone.id}>
                    {zone.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              name="startDate"
              label="Start Date"
              type="date"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="dense"
              name="endDate"
              label="End Date"
              type="date"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Create Action
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}; 