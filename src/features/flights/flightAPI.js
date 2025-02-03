import axios from 'axios';

const API_KEY = '49470a05bcmsha4738fe016f49b0p126714jsnfb4dd34e7fa';

export const searchFlights = async (searchParams) => {
  const options = {
    method: 'GET',
    url: 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlights',
    params: {
      originEntityId: searchParams.originEntityId,
      destinationEntityId: searchParams.destinationEntityId,
      originType: searchParams.originType,
      destinationType: searchParams.destinationType,
      date: searchParams.departureDate,
      returnDate: searchParams.returnDate,
      cabinClass: searchParams.cabinClass,
      adults: searchParams.adults,
      tripType: searchParams.tripType,
      sortBy: searchParams.sortBy,
      currency: searchParams.currency,
      market: searchParams.market,
      countryCode: searchParams.countryCode
    },
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com'
    }
  };

  return axios.request(options);
};
