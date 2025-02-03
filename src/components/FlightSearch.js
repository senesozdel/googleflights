import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FLIGHT_TEXTS, COMMON_TEXTS } from '../constants/static';
import {
  searchAirports,
  fetchFlights,
  setTripType,
  setPassengers,
  setCabinClass,
  setSearchParams,
  swapLocations
} from '../features/flights/flightSlice';
import {
  Paper,
  Button,
  Box,
  Stack,
  Container,
  Autocomplete,
  TextField,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

const FlightSearch = () => {
  const dispatch = useDispatch();
  const {
    tripType,
    passengers,
    cabinClass,
    searchParams,
    originOptions,
    destinationOptions,
    originLoading,
    destLoading
  } = useSelector((state) => state.flights);

  const handleTripTypeChange = (e, value) => {
    if (value) {
      dispatch(setTripType(value));
    }
  };

  const passengerList = [1, 2, 3, 4, 5, 6, 7, 8, 9];


  const handleSearch = () => {
    const requiredFields = tripType === 'roundTrip'
      ? ['origin', 'destination', 'departureDate', 'returnDate']
      : ['origin', 'destination', 'departureDate'];

    const hasEmptyFields = requiredFields.some(field => !searchParams[field]);

    if (hasEmptyFields) {
      alert('Lütfen tüm gerekli alanları doldurun');
      return;
    }

    const searchData = {
      originEntityId: searchParams.origin.id,
      destinationEntityId: searchParams.destination.id,
      originSkyId: searchParams.origin.skyId,
      destinationSkyId: searchParams.destination.skyId,
      departureDate: searchParams.departureDate.format('YYYY-MM-DD'),
      returnDate: tripType === 'roundTrip' ? searchParams.returnDate.format('YYYY-MM-DD') : null,
      cabinClass,
      adults: passengers.toString(),
      sortBy: 'best',
      currency: 'USD',
      market: 'en-US',
      countryCode: 'US'
    };

    dispatch(fetchFlights(searchData));
  };

  return (
    <Container maxWidth="md">
      <Paper 
        sx={{ 
          p: { xs: 2, sm: 3 }, // Mobilde padding azaltıldı
          mt: 3 
        }}
      >
        <Stack spacing={{ xs: 2, sm: 3 }}> {/* Mobilde boşluklar azaltıldı */}
          {/* Üst Kontroller */}
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            alignItems={{ xs: 'stretch', sm: 'center' }}
          >
            <ToggleButtonGroup
              value={tripType}
              exclusive
              onChange={handleTripTypeChange}
              size="small"
              fullWidth // Mobilde tam genişlik
              sx={{ 
                display: 'flex',
                '& .MuiToggleButton-root': {
                  flex: 1
                }
              }}
            >
              <ToggleButton value="roundTrip">{FLIGHT_TEXTS.SEARCH.ROUND_TRIP}</ToggleButton>
              <ToggleButton value="oneWay">{FLIGHT_TEXTS.SEARCH.ONE_WAY}</ToggleButton>
            </ToggleButtonGroup>

            <Stack 
              direction={{ xs: 'row' }} 
              spacing={2} 
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              <FormControl size="small" sx={{ flex: 1 }}>
                <InputLabel>{FLIGHT_TEXTS.SEARCH.PASSENGER}</InputLabel>
                <Select
                  value={passengers}
                  label={FLIGHT_TEXTS.SEARCH.PASSENGER}
                  onChange={(e) => dispatch(setPassengers(e.target.value))}
                >
                  {passengerList.map(num => (
                    <MenuItem key={num} value={num}>{num} {FLIGHT_TEXTS.SEARCH.PASSENGER}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ flex: 1 }}>
                <InputLabel>Class</InputLabel>
                <Select
                  value={cabinClass}
                  label="Class"
                  onChange={(e) => dispatch(setCabinClass(e.target.value))}
                >
                  <MenuItem value="economy">{FLIGHT_TEXTS.CABIN_CLASS.ECONOMY}</MenuItem>
                  <MenuItem value="business">{FLIGHT_TEXTS.CABIN_CLASS.BUSINESS}</MenuItem>
                  <MenuItem value="first">{FLIGHT_TEXTS.CABIN_CLASS.FIRST}</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>

          {/* Lokasyon Seçiciler */}
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            spacing={2} 
            alignItems="center"
          >
  <Autocomplete
  fullWidth
  options={originOptions || []}
  getOptionLabel={(option) => option?.title || ''}
  value={searchParams.origin}
  onChange={(event, newValue) => {
    dispatch(setSearchParams({ origin: newValue }));
  }}
  onInputChange={(event, newInputValue) => {
    dispatch(searchAirports({ searchText: newInputValue, isOrigin: true }));
  }}
  loading={originLoading}
  renderInput={(params) => (
    <TextField
      {...params}
      label={FLIGHT_TEXTS.SEARCH.FROM}
      required
      InputProps={{
        ...params.InputProps,
        endAdornment: (
          <>
            {originLoading ? (
              <CircularProgress color="inherit" size={20} />
            ) : null}
            {params.InputProps.endAdornment}
          </>
        ),
      }}
    />
  )}
  isOptionEqualToValue={(option, value) => 
    option?.id === value?.id || option?.title === value?.title
  }
/>


            <Button
              onClick={() => dispatch(swapLocations())}
              sx={{ 
                minWidth: 'auto',
                transform: { xs: 'rotate(90deg)', md: 'rotate(0deg)' } // Mobilde dikey yön değiştirme
              }}
            >
              <CompareArrowsIcon />
            </Button>

            <Autocomplete
  fullWidth
  options={destinationOptions || []}
  getOptionLabel={(option) => option?.title || ''}
  value={searchParams.destination}
  onChange={(event, newValue) => {
    dispatch(setSearchParams({ destination: newValue }));
  }}
  onInputChange={(event, newInputValue) => {
    dispatch(searchAirports({ searchText: newInputValue, isOrigin: false }));
  }}
  loading={destLoading}
  renderInput={(params) => (
    <TextField
      {...params}
      label={FLIGHT_TEXTS.SEARCH.TO}
      required
      InputProps={{
        ...params.InputProps,
        endAdornment: (
          <>
            {destLoading ? (
              <CircularProgress color="inherit" size={20} />
            ) : null}
            {params.InputProps.endAdornment}
          </>
        ),
      }}
    />
  )}
  isOptionEqualToValue={(option, value) => 
    option?.id === value?.id || option?.title === value?.title
  }
/>

          </Stack>

          {/* Tarih Seçiciler */}
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2}
          >
            <DatePicker
              sx={{ flex: 1 }}
              label={FLIGHT_TEXTS.SEARCH.DEPARTURE_DATE}
              value={searchParams.departureDate}
              onChange={(newValue) => dispatch(setSearchParams({
                departureDate: newValue
              }))}
              required
            />
            {tripType === 'roundTrip' && (
              <DatePicker
                sx={{ flex: 1 }}
                label={FLIGHT_TEXTS.SEARCH.RETURN_DATE}
                value={searchParams.returnDate}
                onChange={(newValue) => dispatch(setSearchParams({
                  returnDate: newValue
                }))}
                required
                minDate={searchParams.departureDate}
              />
            )}
          </Stack>

          <Button
            variant="contained"
            fullWidth
            onClick={handleSearch}
            size="large"
            sx={{ mt: { xs: 2, sm: 3 } }}
          >
            {COMMON_TEXTS.EXPLORE}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default FlightSearch;
