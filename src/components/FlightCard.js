import React, { useState } from 'react';
import { FLIGHT_TEXTS, COMMON_TEXTS } from '../constants/static';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Divider,
  Stack,
  Chip,
  Collapse,
  IconButton
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import moment from 'moment';

const FlightCard = ({ flight, type, isSelected, onSelect }) => {
  const [expanded, setExpanded] = useState(false);
  const leg = flight.legs[0];
  const segment = leg.segments[0];
  const carrier = leg.carriers.marketing[0];


  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateDurationWithMoment = (segments) => {

    const start = segments[0].arrival;
    const end = segments[1].departure;
    const duration = moment.duration(moment(end).diff(moment(start)));

    return `${duration.hours()}hr ${duration.minutes()}min`;
  };


  const formatDuration = (minutes) => {

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}hr ${mins}min`;
  };

  const renderFlightDetails = () => {

      return (
        <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Stack spacing={2}>
            {leg.segments.map((segment, index) => (
              <React.Fragment key={index}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <MoreVertIcon sx={{
                        color: 'action.active',
                        height: 'auto',
                        alignSelf: 'stretch'
                      }} />
                      <Stack>
                        <Typography variant="body2">
                          {formatTime(segment.departure)} - {segment.origin.name}
                        </Typography>
                        <Typography variant="body2">
                          {formatTime(segment.arrival)} - {segment.destination.name}
                        </Typography>
                      </Stack>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {carrier.name} {segment.flightNumber}
                    </Typography>
                  </Stack>

                </Box>
                {index < leg.segments.length - 1 && (
                  <Box sx={{ pl: 4, py: 1 }}>
                    <Typography variant="body2" color="warning.main">
                      {calculateDurationWithMoment(leg.segments)} layover
                    </Typography>
                  </Box>
                )}
              </React.Fragment>
            ))}
          </Stack>
        </Box>
      );
    
  };

  return (
    <Card sx={{
      width: '100%',
      position: 'relative',
      border: isSelected ? '2px solid #1976d2' : '1px solid #ddd',
      '&:hover': {
        boxShadow: 6,
        transform: 'translateY(-2px)',
        transition: 'all 0.3s ease-in-out'
      }
    }}>
      {isSelected && (
        <Chip
          icon={<CheckCircleIcon />}
          label={type === 'departure' ? FLIGHT_TEXTS.RESULTS.SELECTED_DEPARTURE_FLIGHT : FLIGHT_TEXTS.RESULTS.SELECTED_RETURN_FLIGHT }
          color="primary"
          sx={{
            position: 'absolute',
            top: 15,
            right: 80,
            zIndex: 1
          }}
        />
      )}

      <CardContent>
        <Stack spacing={2}>
          {/* price */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <img
                src={carrier.logoUrl}
                alt={carrier.name}
                style={{ height: 24 }}
              />
              <Typography variant="h6" component="div">
                {carrier.name}
              </Typography>
            </Box>
            <Typography variant="h6" color="primary" fontWeight="bold">
              {flight.price.formatted}
            </Typography>
          </Box>

          <Divider />

          {/* Flight Details */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Kalkış */}
            <Box sx={{ textAlign: 'center' }}>
              <FlightTakeoffIcon color="action" />
              <Typography variant="h6">
                {formatTime(leg.departure)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {leg.origin.name}
              </Typography>
            </Box>

            {/* Time and Stops */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTimeIcon fontSize="small" />
                {formatDuration(leg.durationInMinutes)}
              </Typography>
              <Divider sx={{ my: 1, borderStyle: 'dashed' }} />
              <Chip
                label={leg.stopCount === 0 ? 'Nonstop' : `${leg.stopCount} Stop`}
                color={leg.stopCount === 0 ? 'success' : 'warning'}
                size="small"
              />
            </Box>

            {/* Arrive */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ textAlign: 'center' }}>
                <FlightLandIcon color="action" />
                <Typography variant="h6">
                  {formatTime(leg.arrival)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {leg.destination.name}
                </Typography>
              </Box>
              <IconButton
                onClick={() => setExpanded(!expanded)}
                aria-expanded={expanded}
                aria-label="show details"
              >
                {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </Box>
          </Box>

          {/* Details */}
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            {renderFlightDetails()}
          </Collapse>

          <Button
            variant={isSelected ? "outlined" : "contained"}
            fullWidth
            onClick={onSelect}
            color={isSelected ? "success" : "primary"}
          >
            {isSelected ? 'Selected' : 'Select'}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default FlightCard;
