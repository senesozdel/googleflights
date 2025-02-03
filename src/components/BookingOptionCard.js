// components/BookingOptionCard.js
import React from 'react';
import { 
  Paper, 
  Box, 
  Typography, 
  Button,
  Tooltip,
  Stack
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const BookingOptionCard = ({ option, totalPrice }) => {
  const optPrice = option.price + totalPrice;
  
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: { xs: 1.5, sm: 2 }, 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        justifyContent: 'space-between',
        gap: { xs: 2, sm: 0 },
        borderBottom: '1px solid #eee',
        '&:last-child': {
          borderBottom: 'none'
        }
      }}
    >
      {/* Sol Taraf */}
      <Stack 
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={{ xs: 1, sm: 2 }}
      >
        <Box 
          component="img" 
          src={option.logo} 
          alt={option.name}
          sx={{ 
            width: { xs: 24, sm: 32 }, 
            height: { xs: 24, sm: 32 }, 
            objectFit: 'contain' 
          }}
        />
        
        <Box>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={1}
          >
            <Typography 
              variant="subtitle1"
              sx={{ 
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              Book with {option.name}
            </Typography>
            
            {option.additionalInfo && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                width: { xs: '100%', sm: 'auto' }
              }}>
                <Typography 
                  component="span" 
                  variant="caption" 
                  sx={{ 
                    bgcolor: '#f5f5f5', 
                    px: { xs: 0.75, sm: 1 }, 
                    py: 0.5, 
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    width: { xs: '100%', sm: 'auto' }
                  }}
                >
                  {option.additionalInfo}
                  {option.hasTooltip && (
                    <Tooltip title={option.tooltipText || ''}>
                      <InfoOutlinedIcon 
                        sx={{ 
                          fontSize: { xs: 14, sm: 16 }
                        }} 
                      />
                    </Tooltip>
                  )}
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>
      </Stack>

      {/* Sağ Taraf */}
      <Stack 
        direction={{ xs: 'row' }}
        alignItems="center"
        justifyContent={{ xs: 'space-between', sm: 'flex-end' }}
        spacing={{ xs: 1, sm: 2 }}
        sx={{ 
          width: { xs: '100%', sm: 'auto' },
          mt: { xs: 1, sm: 0 }
        }}
      >
        <Typography 
          variant="h6" 
          color="primary"
          sx={{
            fontSize: { xs: '1.1rem', sm: '1.25rem' }
          }}
        >
          ${optPrice}
        </Typography>
        <Button 
          variant="outlined" 
          color="primary"
          href={option.href}
          target="_blank"
          sx={{
            fontSize: { xs: '0.8rem', sm: '0.875rem' },
            py: { xs: 0.5, sm: 1 }
          }}
        >
          Continue
        </Button>
      </Stack>
    </Paper>
  );
};

export default BookingOptionCard;
