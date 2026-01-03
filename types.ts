export interface Room {
  id: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  location: string;
  amenities: string[];
  ownerNumber: string;
  ownerUPI: string;
  isSaved?: boolean;
}

export type ViewState = 'HOME' | 'MAP' | 'POST_ROOM' | 'ROOM_DETAIL' | 'LOGIN' | 'SAVED';

export type SortOption = 'RELEVANCE' | 'PRICE_LOW_HIGH' | 'PRICE_HIGH_LOW' | 'NEWEST';

export interface User {
  name: string;
  email: string;
  avatar?: string;
}

export const ALL_AMENITIES = [
  'Wifi', 'AC', 'Kitchen', 'Parking', 'Security', 'Gym', 'Sea View', 'Lift', 'Maid'
];

// Mock Data
export const MOCK_ROOMS: Room[] = [
  {
    id: '1',
    title: 'Sunny Studio in Indiranagar',
    description: 'A beautiful, sun-lit studio apartment in the heart of the city. Close to metro station and parks. Ideal for bachelors or couples.',
    images: ['https://picsum.photos/800/600?random=1', 'https://picsum.photos/800/600?random=2'],
    price: 15000,
    location: 'Indiranagar, Bangalore',
    amenities: ['Wifi', 'AC', 'Kitchen'],
    ownerNumber: '+919876543210',
    ownerUPI: 'owner@upi'
  },
  {
    id: '2',
    title: 'Cozy 1BHK near Cyber City',
    description: 'Fully furnished 1BHK with modern amenities. Walking distance to major IT parks. 24/7 security and power backup.',
    images: ['https://picsum.photos/800/600?random=3', 'https://picsum.photos/800/600?random=4'],
    price: 22000,
    location: 'Cyber City, Gurugram',
    amenities: ['Parking', 'Security', 'Gym'],
    ownerNumber: '+919876543211',
    ownerUPI: 'landlord@upi'
  },
  {
    id: '3',
    title: 'Spacious Shared Room in Bandra',
    description: 'Looking for a flatmate for a spacious sea-facing apartment. Private washroom and balcony included.',
    images: ['https://picsum.photos/800/600?random=5'],
    price: 18000,
    location: 'Bandra West, Mumbai',
    amenities: ['Sea View', 'Lift', 'Maid'],
    ownerNumber: '+919876543212',
    ownerUPI: 'flatmate@upi'
  }
];