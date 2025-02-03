import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  Stack,
  Button,
  Divider,
  Chip,
} from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const FlightDetail = () => {
  const { id } = useParams();
  const flight = useSelector((state) => 
    state.flights.flights.find(f => f.id === id)
  );

  if (!flight) {
    return (
      <Container>
        <Typography>Uçuş bulunamadı</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Uçuş Detayları
            </Typography>
            <Divider />
          </Box>

          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3
          }}>
            <Box sx={{ flex: '1 1 300px' }}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FlightTakeoffIcon />
                  <Typography variant="h6">
                    Kalkış: {flight.departureCity}
                  </Typography>
                </Box>
                <Typography variant="body1">
                  Havalimanı: {flight.departureAirport}
                </Typography>
                <Typography variant="body1">
                  Tarih: {flight.departureDate}
                </Typography>
                <Typography variant="body1">
                  Saat: {flight.departureTime}
                </Typography>
              </Stack>
            </Box>

            <Box sx={{ flex: '1 1 300px' }}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FlightLandIcon />
                  <Typography variant="h6">
                    Varış: {flight.arrivalCity}
                  </Typography>
                </Box>
                <Typography variant="body1">
                  Havalimanı: {flight.arrivalAirport}
                </Typography>
                <Typography variant="body1">
                  Tarih: {flight.arrivalDate}
                </Typography>
                <Typography variant="body1">
                  Saat: {flight.arrivalTime}
                </Typography>
              </Stack>
            </Box>
          </Box>

          <Divider />

          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            justifyContent: 'space-between'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTimeIcon />
              <Typography>
                Uçuş Süresi: {flight.duration}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AttachMoneyIcon />
              <Typography variant="h5">
                {flight.price} TL
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={1}>
            <Chip label={flight.airline} color="primary" />
            <Chip label={`${flight.flightNumber}`} variant="outlined" />
          </Stack>

          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={() => window.open(flight.bookingLink, '_blank')}
          >
            Bileti Satın Al
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default FlightDetail;
