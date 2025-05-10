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
} from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

interface Zone {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  focusPoint: string;
  metadata: Record<string, any>;
}

export const Zones: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);
  const queryClient = useQueryClient();

  const { data: zones, isLoading } = useQuery<Zone[]>('zones', async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/zones`);
    return response.data;
  });

  const createZone = useMutation(
    async (newZone: Omit<Zone, 'id'>) => {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/zones`,
        newZone
      );
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('zones');
        setOpen(false);
      },
    }
  );

  const handleMapClick = (e: any) => {
    setSelectedPosition([e.latlng.lat, e.latlng.lng]);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newZone = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      latitude: selectedPosition![0],
      longitude: selectedPosition![1],
      focusPoint: formData.get('focusPoint') as string,
      metadata: {},
    };
    createZone.mutate(newZone);
  };

  if (isLoading) {
    return <Typography>Loading zones...</Typography>;
  }

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Monitoring Zones
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpen(true)}
              >
                Add New Zone
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ height: 500 }}>
                <MapContainer
                  center={[0, 0]}
                  zoom={2}
                  style={{ height: '100%', width: '100%' }}
                  onClick={handleMapClick}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {zones?.map((zone) => (
                    <Marker
                      key={zone.id}
                      position={[zone.latitude, zone.longitude]}
                    >
                      <Popup>
                        <Typography variant="subtitle1">{zone.name}</Typography>
                        <Typography variant="body2">{zone.description}</Typography>
                        <Typography variant="body2">
                          Focus: {zone.focusPoint}
                        </Typography>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Zone</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Zone Name"
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
            <TextField
              margin="dense"
              name="focusPoint"
              label="Focus Point"
              type="text"
              fullWidth
              required
            />
            {selectedPosition && (
              <Typography variant="body2" sx={{ mt: 2 }}>
                Selected position: {selectedPosition[0]}, {selectedPosition[1]}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!selectedPosition}
            >
              Create Zone
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}; 