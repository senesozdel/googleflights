// Home.js
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Backdrop, CircularProgress } from '@mui/material';
import {
  Container,
  Typography,
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useMediaQuery,
  Collapse
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import FlightSearch from '../components/FlightSearch';
import FlightList from '../components/FlightList';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [sortBy, setSortBy] = useState('price');

  const { departureFlights, returnFlights, status } = useSelector((state) => state.flights);
  const isLoading = status === 'loading';
  const hasResults = status === 'succeeded' && (departureFlights?.itineraries?.length > 0 || returnFlights?.itineraries?.length > 0);

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const FilterPanel = () => (
    <Box sx={{
      p: 2,
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 2
    }}>
      <Typography variant="h6">
       Filters
      </Typography>



      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={sortBy}
          label="Sıralama"
          onChange={handleSortChange}
          size="small"
        >
          <MenuItem value="price">Best Price</MenuItem>
          <MenuItem value="duration">Lowest Duration</MenuItem>
          <MenuItem value="departure">Departure Time</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>

      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Container maxWidth="xl">
        {/* Üst Kısım - Arama Formu */}
        <Box sx={{ pb: 6 }}>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: {
                xs: '150px',
                sm: '200px',
                md: '300px'
              },
              backgroundImage: 'url(https://www.gstatic.com/travel-frontend/animation/hero/flights_nc_4.svg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
             
            }}
          >
            <Typography
              component="h1"
              variant="h2"
              color="black"
            
              sx={{
                position: 'relative',
                zIndex: 2,
                fontSize: {
                  xs: '2rem',
                  sm: '3rem',
                  md: '4rem'
                },
                paddingTop: {
                  xs: 10,  
                  sm: 15,  
                  md: 20,  
                  lg: 25   
                }
              }}
            >
              Flights
            </Typography>
          </Box>

          <FlightSearch />
        </Box>

        {/* Alt Kısım - Sonuçlar ve Filtreler */}
        <Collapse in={hasResults}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
            {/* Filtre Paneli */}
            <Container>
              <Paper>
                <FilterPanel />
              </Paper>
            </Container>


            {/* Uçuş Listesi */}
            <Box>
              <FlightList sortBy={sortBy} />
            </Box>
          </Box>
        </Collapse>
      </Container>
    </Box>
  );
};

export default Home;
