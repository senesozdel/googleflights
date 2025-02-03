// PaymentPage.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { bookingOptions } from '../constants/bookingTenants'
import {
  Container,
  Box,
  Typography,
  Stack,
  Divider,
  Paper,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import FlightCard from '../components/FlightCard';
import BookingOptionCard from '../components/BookingOptionCard';
import { FLIGHT_TEXTS } from '../constants/static';

const Payment = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { selectedDepartureFlight, selectedReturnFlight } = useSelector(
    (state) => state.flights
  );

  if (!selectedDepartureFlight) {
    return <Navigate to="/" replace />;
  }

  const getTotalPrice = () => {
    let total = selectedDepartureFlight.price.raw;
    if (selectedReturnFlight) {
      total += selectedReturnFlight.price.raw;
    }
    return Math.round(total * 100) / 100;
  };

  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        py: { xs: 2, sm: 4 },
        px: { xs: 1, sm: 2, md: 3 }
      }}
    >
      <Stack 
        spacing={{ xs: 2, sm: 4 }}
        sx={{ mb: { xs: 2, sm: 4 } }}
      >
        {/* Başlık ve Toplam Fiyat */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          justifyContent="space-between"
          spacing={2}
        >
          {/* Şehirler */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={{ xs: 1, sm: 2 }}
            sx={{
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            <Typography 
              variant={isMobile ? "h5" : "h4"}
              sx={{ 
                fontSize: { xs: '1.2rem', sm: '2rem' }
              }}
            >
              {selectedDepartureFlight.legs[0].origin.city}
            </Typography>
            <CompareArrowsIcon sx={{ 
              fontSize: { xs: 20, sm: 30 } 
            }} />
            <Typography 
              variant={isMobile ? "h5" : "h4"}
              sx={{ 
                fontSize: { xs: '1.2rem', sm: '2rem' }
              }}
            >
              {selectedDepartureFlight.legs[0].destination.city}
            </Typography>
          </Stack>

          {/* Toplam Fiyat */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, sm: 2 },
            bgcolor: '#f5f5f5',
            p: { xs: 1.5, sm: 2 },
            borderRadius: 1,
            width: { xs: '100%', sm: 'auto' }
          }}>
            <Typography 
              variant={isMobile ? "subtitle1" : "h6"}
            >
              Total : 
            </Typography>
            <Typography 
              variant={isMobile ? "subtitle1" : "h6"} 
              color="primary" 
              fontWeight="bold"
            >
              ${getTotalPrice()}
            </Typography>
          </Box>
        </Stack>

        {/* Seçilen Uçuşlar */}
        <Stack spacing={{ xs: 2, sm: 3 }}>
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            gutterBottom
          >
            {FLIGHT_TEXTS.RESULTS.SELECTED_FLIGHTS}
          </Typography>

          {/* Gidiş Uçuşu */}
          <Box>
            <Typography 
              variant="subtitle1" 
              color="primary" 
              gutterBottom
              sx={{ 
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              {FLIGHT_TEXTS.RESULTS.DEPARTING_FLIGHTS}
            </Typography>
            <FlightCard
              flight={selectedDepartureFlight}
              type="departure"
              isSelected={true}
              onSelect={() => {}}
            />
          </Box>

          {/* Dönüş Uçuşu */}
          {selectedReturnFlight && (
            <Box>
              <Typography 
                variant="subtitle1" 
                color="primary" 
                gutterBottom
                sx={{ 
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}
              >
                {FLIGHT_TEXTS.RESULTS.RETURNING_FLIGHTS}
              </Typography>
              <FlightCard
                flight={selectedReturnFlight}
                type="return"
                isSelected={true}
                onSelect={() => {}}
              />
            </Box>
          )}
        </Stack>

        <Divider />

        {/* Booking Options */}
        <Box>
          <Stack 
            direction="row" 
            alignItems="center" 
            spacing={1} 
            sx={{ mb: { xs: 1.5, sm: 2 } }}
          >
            <Typography 
              variant={isMobile ? "subtitle1" : "h6"}
            >
              Booking options
            </Typography>
            <Tooltip title="How options are ranked">
              <InfoOutlinedIcon 
                sx={{ 
                  fontSize: { xs: 18, sm: 20 }
                }} 
                color="action" 
              />
            </Tooltip>
          </Stack>

          <Paper 
            variant="outlined"
            sx={{
              borderRadius: { xs: 1, sm: 2 }
            }}
          >
            {bookingOptions.map((option) => (
              <BookingOptionCard
                key={option.id}
                option={option}
                totalPrice={getTotalPrice()}
              />
            ))}
          </Paper>
        </Box>
      </Stack>
    </Container>
  );
};

export default Payment;
