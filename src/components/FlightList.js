import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FlightCard from './FlightCard';
import { Box, Container, CircularProgress, Alert, Typography, Button, Chip } from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import { setSelectedDepartureFlight, setSelectedReturnFlight } from '../features/flights/flightSlice';
import Snackbar from '@mui/material/Snackbar';
import { FLIGHT_TEXTS} from '../constants/static';

const FlightList = ({ sortBy }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { departureFlights, returnFlights, status, error, tripType, selectedDepartureFlight, selectedReturnFlight } = useSelector((state) => state.flights);

 

  const sortFlights = (flights) => {
    if (!flights?.itineraries) return flights;

    const sortedFlights = { ...flights };

    sortedFlights.itineraries = [...flights.itineraries].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price.raw - b.price.raw;
        case 'duration':
          return a.legs[0].durationInMinutes - b.legs[0].durationInMinutes;
        case 'departure':
          return new Date(a.legs[0].departure) - new Date(b.legs[0].departure);
        default:
          return 0;
      }
    });

    return sortedFlights;
  };

  const sortedDepartureFlights = sortFlights(departureFlights);
  const sortedReturnFlights = sortFlights(returnFlights);

  const handleSnackbarClick = () => {
    navigate('/payment');
    setSnackbarOpen(false);
  };

  const handleFlightSelect = (flight, type) => {
    if (type === 'departure') {
      dispatch(setSelectedDepartureFlight(flight));
      dispatch(setSelectedReturnFlight(null));
      if (tripType === 'oneWay') {
        setSnackbarOpen(true);
      }

    } 
    else {
      dispatch(setSelectedReturnFlight(flight));
      if (tripType === 'roundTrip') {
        setSnackbarOpen(true);
      }
    }
  };


  if (status === 'loading') {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (status === 'failed') {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!sortedDepartureFlights?.itineraries?.length && status === 'succeeded') {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">Suitable flight is not found.</Alert>
      </Container>
    );
  }

  const getTotalPrice = () => {
    let total = 0;
    if (selectedDepartureFlight) {
      total += selectedDepartureFlight.price.raw;
    }
    if (selectedReturnFlight) {
      total += selectedReturnFlight.price.raw;
    }
    return total.toFixed(2);
  };

  const showPaymentButton = tripType === 'oneWay'
    ? selectedDepartureFlight
    : (selectedDepartureFlight && selectedReturnFlight);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>

      {/* Selection Result*/}
      {(selectedDepartureFlight || selectedReturnFlight) && (
        <Box marginBottom={5}>
          <Typography variant="h5" gutterBottom>
            { }
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            {selectedDepartureFlight && (
              <Chip
                label={`Departing: ${selectedDepartureFlight.price.formatted}`}
                color="primary"
                onDelete={() => dispatch(setSelectedDepartureFlight(null))}
              />
            )}
            {selectedReturnFlight && (
              <Chip
                label={`Returning: ${selectedReturnFlight.price.formatted}`}
                color="primary"
                onDelete={() => dispatch(setSelectedReturnFlight(null))}
              />
            )}

            {showPaymentButton && (
              <Chip
                label={`Go To Checkout ($${getTotalPrice()})`}
                color="success"
                onClick={() => { navigate("/payment") }}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'success.dark',
                  },
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  height: '32px'
                }}
                icon={<PaymentIcon />}
              />
            )}
          </Box>
        </Box>

      )}

      {/* Departing Flights*/}
      {
        (!selectedDepartureFlight || tripType === 'oneWay') && (
          <>
            <Typography variant="h5" gutterBottom>
              {FLIGHT_TEXTS.RESULTS.DEPARTING_FLIGHTS}({sortedDepartureFlights?.itineraries?.length || 0})
            </Typography>
            <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(1, 1fr)' }, mb: 4 }}>
              {sortedDepartureFlights?.itineraries?.map((flight) => (
                <FlightCard
                  key={flight.id}
                  flight={flight}
                  type="departure"
                  isSelected={selectedDepartureFlight?.id === flight.id}
                  onSelect={() => handleFlightSelect(flight, 'departure')}
                />
              ))}
            </Box>
          </>
        )
      }

      {/*Returning Flights*/}
      {tripType === 'roundTrip' && selectedDepartureFlight && sortedReturnFlights && (
        <>
          <Typography variant="h5" gutterBottom>
            {FLIGHT_TEXTS.RESULTS.RETURNING_FLIGHTS} ({sortedReturnFlights?.itineraries?.length || 0})
          </Typography>
          <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: 'repeat(1, 1fr)', lg: 'repeat(1, 1fr)' } }}>
            {sortedReturnFlights?.itineraries?.map((flight) => (
              <FlightCard
                key={flight.id}
                flight={flight}
                type="return"
                isSelected={selectedReturnFlight?.id === flight.id}
                onSelect={() => handleFlightSelect(flight, 'return')}
              />
            ))}
          </Box>
        </>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity="success"
          variant="filled"
          sx={{
            width: '100%',
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.9,
            }
          }}
          onClick={handleSnackbarClick}
        >
          Checkout Flights
        </Alert>
      </Snackbar>

    </Container>
  );
};

export default FlightList;
