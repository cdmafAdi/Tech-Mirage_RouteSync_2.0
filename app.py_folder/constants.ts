
import { BusRoute, MetroStation, PuneSpot } from './types';

export interface StationCoord extends MetroStation {
  lat: number;
  lng: number;
}

export const METRO_PURPLE_COORDS: StationCoord[] = [
  { name: 'PCMC', line: 'Purple', order: 1, lat: 18.6231, lng: 73.8150 },
  { name: 'Sant Tukaram Nagar', line: 'Purple', order: 2, lat: 18.6155, lng: 73.8210 },
  { name: 'Bhosari', line: 'Purple', order: 3, lat: 18.6044, lng: 73.8340 },
  { name: 'Kasarwadi', line: 'Purple', order: 4, lat: 18.5950, lng: 73.8320 },
  { name: 'Phugewadi', line: 'Purple', order: 5, lat: 18.5830, lng: 73.8310 },
  { name: 'Dapodi', line: 'Purple', order: 6, lat: 18.5775, lng: 73.8322 },
  { name: 'Bopodi', line: 'Purple', order: 7, lat: 18.5650, lng: 73.8340 },
  { name: 'Khadki', line: 'Purple', order: 8, lat: 18.5520, lng: 73.8410 },
  { name: 'Range Hill', line: 'Purple', order: 9, lat: 18.5410, lng: 73.8450 },
  { name: 'Shivaji Nagar', line: 'Purple', order: 10, lat: 18.5310, lng: 73.8505 },
  { name: 'Civil Court', line: 'Purple', order: 11, lat: 18.5284, lng: 73.8546 },
  { name: 'Budhwar Peth', line: 'Purple', order: 12, lat: 18.5190, lng: 73.8560 },
  { name: 'Mandai', line: 'Purple', order: 13, lat: 18.5110, lng: 73.8570 },
  { name: 'Swargate', line: 'Purple', order: 14, lat: 18.5018, lng: 73.8585 },
];

export const METRO_AQUA_COORDS: StationCoord[] = [
  { name: 'Vanaz', line: 'Aqua', order: 1, lat: 18.5065, lng: 73.8115 },
  { name: 'Anand Nagar', line: 'Aqua', order: 2, lat: 18.5090, lng: 73.8200 },
  { name: 'Ideal Colony', line: 'Aqua', order: 3, lat: 18.5115, lng: 73.8280 },
  { name: 'Nal Stop', line: 'Aqua', order: 4, lat: 18.5140, lng: 73.8350 },
  { name: 'Garware College', line: 'Aqua', order: 5, lat: 18.5186, lng: 73.8407 },
  { name: 'Deccan Gymkhana', line: 'Aqua', order: 6, lat: 18.5210, lng: 73.8440 },
  { name: 'Chhatrapati Sambhaji Udyan', line: 'Aqua', order: 7, lat: 18.5240, lng: 73.8480 },
  { name: 'PMC', line: 'Aqua', order: 8, lat: 18.5265, lng: 73.8510 },
  { name: 'Civil Court', line: 'Aqua', order: 9, lat: 18.5284, lng: 73.8546 },
  { name: 'Mangalwar Peth', line: 'Aqua', order: 10, lat: 18.5295, lng: 73.8640 },
  { name: 'Pune Station', line: 'Aqua', order: 11, lat: 18.5280, lng: 73.8739 },
  { name: 'Ruby Hall Clinic', line: 'Aqua', order: 12, lat: 18.5330, lng: 73.8810 },
  { name: 'Bund Garden', line: 'Aqua', order: 13, lat: 18.5390, lng: 73.8900 },
  { name: 'Yerawada', line: 'Aqua', order: 14, lat: 18.5450, lng: 73.8980 },
  { name: 'Kalyani Nagar', line: 'Aqua', order: 15, lat: 18.5510, lng: 73.9050 },
  { name: 'Ramwadi', line: 'Aqua', order: 16, lat: 18.5562, lng: 73.9103 },
];

export const CAB_ROUTE_AIRPORT_PATH = [
  { name: 'Pune Station', lat: 18.5280, lng: 73.8739 },
  { name: 'Tadiwala Road Crossing', lat: 18.5350, lng: 73.8780 },
  { name: 'Bund Garden Bridge', lat: 18.5390, lng: 73.8900 },
  { name: 'Yerawada Bridge Signal', lat: 18.5450, lng: 73.8980 },
  { name: 'Golf Course Chowk', lat: 18.5520, lng: 73.9020 },
  { name: 'Airport Road Corner', lat: 18.5580, lng: 73.9050 },
  { name: 'Pune Airport (PNQ)', lat: 18.5793, lng: 73.9089 },
];

export const BUS_ROUTE_10_PATH = [
  { name: 'Janata Vasahat', lat: 18.4900, lng: 73.8400 },
  { name: 'Laxmi Nagar Bend', lat: 18.4930, lng: 73.8420 },
  { name: 'Dandekar Bridge Signal', lat: 18.4960, lng: 73.8450 },
  { name: 'Saras Baug Corner', lat: 18.5040, lng: 73.8520 },
  { name: 'Swargate Bus Stand', lat: 18.5018, lng: 73.8585 },
  { name: 'Hirabaug Signal', lat: 18.5050, lng: 73.8540 },
  { name: 'Tilak Road Chowk', lat: 18.5080, lng: 73.8470 },
  { name: 'Alka Talkies Signal', lat: 18.5140, lng: 73.8430 },
  { name: 'Deccan Bus Stop', lat: 18.5175, lng: 73.8415 },
  { name: 'Modern College Stop', lat: 18.5250, lng: 73.8450 },
  { name: 'Shivaji Nagar Stand', lat: 18.5310, lng: 73.8505 },
];

export const BUS_ROUTE_1_PATH = [
  { name: 'Pune Station', lat: 18.5280, lng: 73.8739 },
  { name: 'Collector Office Crossing', lat: 18.5290, lng: 73.8680 },
  { name: 'Zilla Parishad', lat: 18.5285, lng: 73.8640 },
  { name: 'Phadke Haud', lat: 18.5220, lng: 73.8580 },
  { name: 'PMC Building Stop', lat: 18.5265, lng: 73.8510 },
  { name: 'Congress Bhavan', lat: 18.5290, lng: 73.8500 },
  { name: 'Shivaji Nagar Depot', lat: 18.5310, lng: 73.8505 },
];

export const BUS_ROUTE_5_PATH = [
  { name: 'Pune Station Depot', lat: 18.5280, lng: 73.8739 },
  { name: 'KEM Hospital Corner', lat: 18.5240, lng: 73.8710 },
  { name: 'Nana Peth Crossing', lat: 18.5180, lng: 73.8650 },
  { name: 'Seven Loves Chowk', lat: 18.5100, lng: 73.8620 },
  { name: 'Swargate Square', lat: 18.5018, lng: 73.8585 },
];

export const PMPML_BUSES: BusRoute[] = [
  // Swargate to Katraj
  { route_number: '301', origin: 'Swargate', destination: 'Katraj', firstBus: '7:00', lastBus: '23:30', frequency: '30 min', stopsCount: 12, approx_distance_km: 8, estimatedPrice: 20 },
  { route_number: '24', origin: 'Swargate', destination: 'Katraj', firstBus: '5:35', lastBus: '10:50', frequency: '11 min', stopsCount: 11, approx_distance_km: 8, estimatedPrice: 20 },
  { route_number: '295', origin: 'Swargate', destination: 'Katraj', firstBus: '6:50', lastBus: '22:00', frequency: '12 min', stopsCount: 12, approx_distance_km: 8, estimatedPrice: 20 },

  // Hadapsar to Katraj
  { route_number: '301-H', origin: 'Hadapsar', destination: 'Katraj', firstBus: '4:40', lastBus: '22:45', frequency: '30 min', stopsCount: 29, travelTime: '67 min', approx_distance_km: 15, estimatedPrice: 25 },
  { route_number: '291', origin: 'Hadapsar', destination: 'Katraj', firstBus: '5:00', lastBus: '23:00', frequency: '35 min', stopsCount: 36, travelTime: '65 min', approx_distance_km: 15, estimatedPrice: 25 },
  { route_number: '188', origin: 'Hadapsar', destination: 'Katraj', firstBus: '6:00', lastBus: '22:40', frequency: '69 min', stopsCount: 41, travelTime: '94 min', approx_distance_km: 15, estimatedPrice: 30 },

  // Pune Station to Aundhgaon
  { route_number: '348', origin: 'Pune Station', destination: 'Aundhgaon', firstBus: '5:10', lastBus: '21:20', frequency: '18 min', stopsCount: 21, approx_distance_km: 12, estimatedPrice: 20 },

  // Pune Station to Shivajinagar
  { route_number: '317-P', origin: 'Pune Station', destination: 'Shivajinagar', firstBus: '5:00', lastBus: '21:30', frequency: '120 min', stopsCount: 4, approx_distance_km: 3, estimatedPrice: 10 },

  // Shivajinagar to Katraj
  { route_number: '2A', origin: 'Shivajinagar', destination: 'Katraj', firstBus: '6:00', lastBus: '23:00', frequency: '160 min', stopsCount: 22, approx_distance_km: 10, estimatedPrice: 20 },
  { route_number: '298A', origin: 'Shivajinagar', destination: 'Katraj', firstBus: '6:00', lastBus: '22:15', frequency: '54 min', stopsCount: 29, approx_distance_km: 10, estimatedPrice: 20 },

  // Hadapsar to Aundh
  { route_number: '204', origin: 'Hadapsar', destination: 'Aundh', firstBus: '4:50', lastBus: '22:15', frequency: '17 min', stopsCount: 35, approx_distance_km: 22, estimatedPrice: 35 },

  // Pune Station to Swargate
  { route_number: '5', origin: 'Pune Station', destination: 'Swargate', firstBus: '5:30', lastBus: '23:05', frequency: '10 min', stopsCount: 14, approx_distance_km: 4, estimatedPrice: 15 },

  // Swargate to Alandi
  { route_number: '29', origin: 'Swargate', destination: 'Alandi', firstBus: '5:30', lastBus: '22:30', frequency: '16 min', stopsCount: 50, approx_distance_km: 23, estimatedPrice: 40 },

  // Pune Station to Kothrud
  { route_number: '94', origin: 'Pune Station', destination: 'Kothrud', firstBus: '5:35', lastBus: '22:10', frequency: '24 min', stopsCount: 28, approx_distance_km: 8, estimatedPrice: 20 },
  { route_number: '86B', origin: 'Pune Station', destination: 'Kothrud', firstBus: '9:00', lastBus: '22:10', frequency: '30 min', stopsCount: 26, approx_distance_km: 8, estimatedPrice: 20 },

  // Nigdi to Bhosari
  { route_number: '149', origin: 'Nigdi', destination: 'Bhosari', firstBus: '5:30', lastBus: '23:00', frequency: '13 min', stopsCount: 26, approx_distance_km: 12, estimatedPrice: 25 },

  // Nigdi to Shivajinagar
  { route_number: '42', origin: 'Nigdi', destination: 'Shivajinagar', firstBus: '5:30', lastBus: '22:50', frequency: '14 min', stopsCount: 28, approx_distance_km: 18, estimatedPrice: 30 },
  { route_number: '317-N', origin: 'Nigdi', destination: 'Shivajinagar', firstBus: '5:00', lastBus: '23:00', frequency: '50 min', stopsCount: 28, approx_distance_km: 18, estimatedPrice: 30 },
];

export const METRO_PURPLE: MetroStation[] = METRO_PURPLE_COORDS;
export const METRO_AQUA: MetroStation[] = METRO_AQUA_COORDS;

export const PUNE_SPOTS: PuneSpot[] = [
  { 
    name: 'Shaniwar Wada', 
    description: 'Historical fortification built in 1732.', 
    category: 'Heritage', 
    bestRoute: 'Bus 10 / Metro PMC Station',
    imageUrl: 'https://www.thehistoryhub.com/wp-content/uploads/2016/11/Shaniwar-Wada.jpg'
  },
  { 
    name: 'Aga Khan Palace', 
    description: 'Majestic building closely linked to the Indian independence movement.', 
    category: 'Historical', 
    bestRoute: 'Metro Yerawada Station',
    imageUrl: 'https://www.mkgandhi.org/images/agakhan.jpg'
  },
  { 
    name: 'Dagdusheth Halwai Ganpati', 
    description: 'Most popular Hindu temple dedicated to Lord Ganesha.', 
    category: 'Religious', 
    bestRoute: 'Metro Budhwar Peth',
    imageUrl: 'https://c8.alamy.com/comp/2JW2MTC/02-september-2022-pune-maharashtra-india-beautiful-sculpture-of-lord-ganesh-called-as-dagdusheth-halwai-ganpati-near-pune-mandai-location-during-2JW2MTC.jpg'
  },
];
