import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {API_CONFIG} from '../../config/api'

// searchAirports async thunk
export const searchAirports = createAsyncThunk(
  'flights/searchAirports',
  async ({ searchText, isOrigin }) => {
    if (searchText.length < 2) return [];

    const options = {
      method: 'GET',
      url:  `${API_CONFIG.BASE_URL}/searchAirport`,
      params: { query: searchText },
      headers:  API_CONFIG.HEADERS
    };

    const response = await fetch(options.url + '?' + new URLSearchParams(options.params), {
      headers: API_CONFIG.HEADERS
    });
    const data = await response.json();
    
    return {
      data: data.data.map(location => ({
        title: `${location.presentation.title} ${location.presentation.suggestionTitle ? `(${location.presentation.suggestionTitle})` : ''} / ${location.presentation.subtitle}`,
        id: location.navigation.entityId,
        entityType: location.navigation.entityType,
        skyId: location.skyId,
        localizedName: location.navigation.localizedName
      })),
      isOrigin
    };
  }
);

// fetchFlights async thunk
export const fetchFlights = createAsyncThunk(
  'flights/fetchFlights',
  async (searchData) => {
    const options = {
      method: 'GET',
      headers: API_CONFIG.HEADERS
    };

    //departing flight request
    const departureParams = {
      originEntityId: searchData.originEntityId,
      destinationEntityId: searchData.destinationEntityId,
      originSkyId: searchData.originSkyId,
      destinationSkyId: searchData.destinationSkyId,
      date: searchData.departureDate,
      cabinClass: searchData.cabinClass,
      adults: searchData.adults,
      sortBy: searchData.sortBy,
      currency: searchData.currency,
      market: searchData.market,
      countryCode: searchData.countryCode
    };

    const departureResponse = await fetch(
      `${API_CONFIG.BASE_URL}/searchFlights?`
       + 
      new URLSearchParams(departureParams),
      options
    );
    const departureData = await departureResponse.json();

    let returnData = null;
    if (searchData.returnDate) {
      const returnParams = {
        originEntityId: searchData.destinationEntityId,
        destinationEntityId: searchData.originEntityId,
        originSkyId: searchData.destinationSkyId,
        destinationSkyId: searchData.originSkyId,
        date: searchData.returnDate,
        cabinClass: searchData.cabinClass,
        adults: searchData.adults,
        sortBy: searchData.sortBy,
        currency: searchData.currency,
        market: searchData.market,
        countryCode: searchData.countryCode
      };

      const returnResponse = await fetch(
        `${API_CONFIG.BASE_URL}/searchFlights?`+ 
        new URLSearchParams(returnParams),
        options
      );
      returnData = await returnResponse.json();
    }

    return {
      departureFlights: departureData.data,
      returnFlights: returnData ? returnData.data : null
    };
  }
);

const flightSlice = createSlice({
  name: 'flights',
  initialState: {
    tripType: 'roundTrip',
    passengers: 1,
    cabinClass: 'economy',
    searchParams: {
      origin: null,
      destination: null,
      departureDate: null,
      returnDate: null,
    },
    originOptions: [],
    destinationOptions: [],
    originLoading: false,
    destLoading: false,
    departureFlights: [],
    returnFlights: null,
    selectedDepartureFlight: null,
    selectedReturnFlight: null,
    status: 'idle',
    error: null
  },
  reducers: {
    setTripType: (state, action) => {
      state.tripType = action.payload;
      if (action.payload === 'oneWay') {
        state.searchParams.returnDate = null;
        state.returnFlights = null;
        state.selectedReturnFlight = null;
      }
    },
    setPassengers: (state, action) => {
      state.passengers = action.payload;
    },
    setCabinClass: (state, action) => {
      state.cabinClass = action.payload;
    },
    setSearchParams: (state, action) => {
      state.searchParams = { ...state.searchParams, ...action.payload };
    },
    swapLocations: (state) => {
      const temp = state.searchParams.origin;
      state.searchParams.origin = state.searchParams.destination;
      state.searchParams.destination = temp;
    },
    setSelectedDepartureFlight: (state, action) => {
      state.selectedDepartureFlight = action.payload;
    },
    setSelectedReturnFlight: (state, action) => {
      state.selectedReturnFlight = action.payload;
    },
    clearSelectedFlights: (state) => {
      state.selectedDepartureFlight = null;
      state.selectedReturnFlight = null;
    },
    clearFlightResults: (state) => {
      state.departureFlights = [];
      state.returnFlights = null;
      state.selectedDepartureFlight = null;
      state.selectedReturnFlight = null;
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      // searchAirports
      .addCase(searchAirports.pending, (state, action) => {
        if (action.meta.arg.isOrigin) {
          state.originLoading = true;
        } else {
          state.destLoading = true;
        }
      })
      .addCase(searchAirports.fulfilled, (state, action) => {
        if (action.payload.isOrigin) {
          state.originOptions = action.payload.data;
          state.originLoading = false;
        } else {
          state.destinationOptions = action.payload.data;
          state.destLoading = false;
        }
      })
      .addCase(searchAirports.rejected, (state, action) => {
        state.error = action.error.message;
        state.originLoading = false;
        state.destLoading = false;
      })
      // fetchFlights
      .addCase(fetchFlights.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchFlights.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.departureFlights = action.payload.departureFlights;
        state.returnFlights = action.payload.returnFlights;
        state.selectedDepartureFlight = null;
        state.selectedReturnFlight = null;
      })
      .addCase(fetchFlights.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const {
  setTripType,
  setPassengers,
  setCabinClass,
  setSearchParams,
  swapLocations,
  setSelectedDepartureFlight,
  setSelectedReturnFlight,
  clearSelectedFlights,
  clearFlightResults
} = flightSlice.actions;

export default flightSlice.reducer;
