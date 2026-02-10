
export enum TransportMode {
  BUS = 'BUS',
  METRO = 'METRO',
  CAB = 'CAB'
}

export interface BusRoute {
  route_number: string;
  origin: string;
  destination: string;
  approx_distance_km: number;
  firstBus?: string;
  lastBus?: string;
  frequency?: string;
  stopsCount?: number;
  travelTime?: string;
  estimatedPrice?: number;
}

export interface MetroStation {
  name: string;
  line: 'Purple' | 'Aqua';
  order: number;
}

export interface TravelOption {
  id: string;
  mode: TransportMode;
  route: string;
  eta: string;
  cost: number;
  convenience: 'High' | 'Medium' | 'Low';
  description: string;
}

export interface TravelHistoryItem {
  id: string;
  date: string;
  from: string;
  to: string;
  mode: TransportMode;
  cost: number;
}

export interface PuneSpot {
  name: string;
  description: string;
  category: string;
  bestRoute: string;
  imageUrl: string;
}
