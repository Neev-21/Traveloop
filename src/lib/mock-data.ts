export type Trip = {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  description: string;
  cover_photo: string;
  stops: Stop[];
  expenses: Expense[];
  packing: PackingItem[];
  notes: Note[];
};
export type Stop = {
  id: string;
  city_name: string;
  country: string;
  start_date: string;
  end_date: string;
  order_index: number;
  activities: Activity[];
};
export type Activity = {
  id: string;
  name: string;
  type: string;
  cost: number;
  duration: string;
  time: string;
};
export type Expense = { id: string; category: 'transport' | 'stay' | 'meals' | 'activities'; amount: number; label: string };
export type PackingItem = { id: string; category: string; item_name: string; is_packed: boolean };
export type Note = { id: string; stop_id?: string; content: string; timestamp: string };

export type City = { name: string; country: string; cost_index: number; popularity: number; image: string; tag: string };

export const POPULAR_CITIES: City[] = [
  { name: 'Manali', country: 'India', cost_index: 38, popularity: 92, image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', tag: 'Mountains' },
  { name: 'Jaipur', country: 'India', cost_index: 35, popularity: 88, image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800', tag: 'Heritage' },
  { name: 'Kerala', country: 'India', cost_index: 42, popularity: 95, image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800', tag: 'Backwaters' },
  { name: 'Mumbai', country: 'India', cost_index: 55, popularity: 90, image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800', tag: 'Metro' },
  { name: 'Rishikesh', country: 'India', cost_index: 30, popularity: 82, image: 'https://images.unsplash.com/photo-1561361398-a1d6cf5b1963?w=800', tag: 'Spiritual' },
  { name: 'Goa', country: 'India', cost_index: 48, popularity: 96, image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800', tag: 'Beach' },
  { name: 'Bali', country: 'Indonesia', cost_index: 52, popularity: 98, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', tag: 'Tropical' },
  { name: 'Tokyo', country: 'Japan', cost_index: 88, popularity: 97, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', tag: 'City' },
  { name: 'Rome', country: 'Italy', cost_index: 78, popularity: 94, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800', tag: 'Historic' },
  { name: 'New York', country: 'USA', cost_index: 95, popularity: 99, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800', tag: 'Metro' },
  { name: 'Paris', country: 'France', cost_index: 82, popularity: 96, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', tag: 'Romantic' },
  { name: 'Santorini', country: 'Greece', cost_index: 75, popularity: 93, image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800', tag: 'Island' },
];

export const ACTIVITY_LIBRARY: Omit<Activity, 'id' | 'time'>[] = [
  { name: 'Solang Valley Paragliding', type: 'Adventure', cost: 2500, duration: '3h' },
  { name: 'Hadimba Temple Visit', type: 'Culture', cost: 0, duration: '1h' },
  { name: 'Amber Fort Tour', type: 'Sightseeing', cost: 800, duration: '4h' },
  { name: 'City Palace Jaipur', type: 'Culture', cost: 500, duration: '2h' },
  { name: 'Alleppey Houseboat', type: 'Experience', cost: 6000, duration: '24h' },
  { name: 'Kathakali Performance', type: 'Culture', cost: 400, duration: '1.5h' },
  { name: 'Marine Drive Walk', type: 'Sightseeing', cost: 0, duration: '1h' },
  { name: 'Gateway of India', type: 'Sightseeing', cost: 0, duration: '1h' },
  { name: 'Ganga Aarti Triveni Ghat', type: 'Spiritual', cost: 0, duration: '1h' },
  { name: 'Beach Yoga Class', type: 'Wellness', cost: 600, duration: '1h' },
  { name: 'Ubud Rice Terraces', type: 'Nature', cost: 1200, duration: '5h' },
  { name: 'Tea Ceremony', type: 'Culture', cost: 3500, duration: '2h' },
  { name: 'Colosseum Skip-the-Line', type: 'Historic', cost: 4000, duration: '3h' },
  { name: 'Statue of Liberty Cruise', type: 'Sightseeing', cost: 3000, duration: '3h' },
  { name: 'Eiffel Tower Summit', type: 'Sightseeing', cost: 2800, duration: '2h' },
  { name: 'Sunset Catamaran', type: 'Experience', cost: 5500, duration: '4h' },
];

export const SEED_TRIPS: Trip[] = [
  {
    id: 't1',
    name: 'Himalayan Escape',
    start_date: '2026-06-01',
    end_date: '2026-06-10',
    description: 'A refreshing journey through the mountains and spiritual towns of North India.',
    cover_photo: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1600',
    stops: [
      {
        id: 's1', city_name: 'Manali', country: 'India', start_date: '2026-06-01', end_date: '2026-06-05', order_index: 0,
        activities: [
          { id: 'a1', name: 'Solang Valley Paragliding', type: 'Adventure', cost: 2500, duration: '3h', time: '10:00' },
          { id: 'a2', name: 'Hadimba Temple Visit', type: 'Culture', cost: 0, duration: '1h', time: '15:00' },
        ],
      },
      {
        id: 's2', city_name: 'Rishikesh', country: 'India', start_date: '2026-06-06', end_date: '2026-06-10', order_index: 1,
        activities: [
          { id: 'a3', name: 'Ganga Aarti Triveni Ghat', type: 'Spiritual', cost: 0, duration: '1h', time: '18:30' },
        ],
      },
    ],
    expenses: [
      { id: 'e1', category: 'transport', amount: 18000, label: 'Flights & cabs' },
      { id: 'e2', category: 'stay', amount: 24000, label: 'Hotels' },
      { id: 'e3', category: 'meals', amount: 9000, label: 'Food' },
      { id: 'e4', category: 'activities', amount: 7500, label: 'Tours' },
    ],
    packing: [
      { id: 'p1', category: 'Clothing', item_name: 'Warm Jacket', is_packed: true },
      { id: 'p2', category: 'Clothing', item_name: 'Trekking Shoes', is_packed: false },
      { id: 'p3', category: 'Electronics', item_name: 'Power Bank', is_packed: true },
      { id: 'p4', category: 'Documents', item_name: 'ID Proof', is_packed: false },
    ],
    notes: [
      { id: 'n1', content: 'Carry cash for local taxis in Manali.', timestamp: '2026-05-20T10:00:00Z' },
    ],
  },
  {
    id: 't2',
    name: 'Bali Bliss',
    start_date: '2026-09-12',
    end_date: '2026-09-22',
    description: 'Tropical island getaway with beaches, temples, and rice terraces.',
    cover_photo: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600',
    stops: [
      {
        id: 's3', city_name: 'Ubud', country: 'Indonesia', start_date: '2026-09-12', end_date: '2026-09-17', order_index: 0,
        activities: [
          { id: 'a4', name: 'Ubud Rice Terraces', type: 'Nature', cost: 1200, duration: '5h', time: '09:00' },
        ],
      },
      {
        id: 's4', city_name: 'Seminyak', country: 'Indonesia', start_date: '2026-09-18', end_date: '2026-09-22', order_index: 1,
        activities: [
          { id: 'a5', name: 'Sunset Catamaran', type: 'Experience', cost: 5500, duration: '4h', time: '17:00' },
        ],
      },
    ],
    expenses: [
      { id: 'e5', category: 'transport', amount: 65000, label: 'Flights' },
      { id: 'e6', category: 'stay', amount: 48000, label: 'Villas' },
      { id: 'e7', category: 'meals', amount: 18000, label: 'Food' },
      { id: 'e8', category: 'activities', amount: 22000, label: 'Tours' },
    ],
    packing: [
      { id: 'p5', category: 'Clothing', item_name: 'Swimwear', is_packed: false },
      { id: 'p6', category: 'Clothing', item_name: 'Sun Hat', is_packed: false },
      { id: 'p7', category: 'Toiletries', item_name: 'Sunscreen SPF 50', is_packed: true },
    ],
    notes: [],
  },
  {
    id: 't3',
    name: 'European Classics',
    start_date: '2026-10-05',
    end_date: '2026-10-18',
    description: 'Rome to Paris — history, art, and cuisine.',
    cover_photo: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600',
    stops: [
      {
        id: 's5', city_name: 'Rome', country: 'Italy', start_date: '2026-10-05', end_date: '2026-10-10', order_index: 0,
        activities: [
          { id: 'a6', name: 'Colosseum Skip-the-Line', type: 'Historic', cost: 4000, duration: '3h', time: '10:00' },
        ],
      },
      {
        id: 's6', city_name: 'Paris', country: 'France', start_date: '2026-10-11', end_date: '2026-10-18', order_index: 1,
        activities: [
          { id: 'a7', name: 'Eiffel Tower Summit', type: 'Sightseeing', cost: 2800, duration: '2h', time: '14:00' },
        ],
      },
    ],
    expenses: [
      { id: 'e9', category: 'transport', amount: 90000, label: 'Flights & trains' },
      { id: 'e10', category: 'stay', amount: 110000, label: 'Hotels' },
      { id: 'e11', category: 'meals', amount: 35000, label: 'Restaurants' },
      { id: 'e12', category: 'activities', amount: 28000, label: 'Museums & tours' },
    ],
    packing: [
      { id: 'p8', category: 'Documents', item_name: 'Passport', is_packed: true },
      { id: 'p9', category: 'Documents', item_name: 'Schengen Visa', is_packed: true },
      { id: 'p10', category: 'Electronics', item_name: 'Universal Adapter', is_packed: false },
    ],
    notes: [{ id: 'n2', content: 'Book Vatican tickets 2 weeks ahead.', timestamp: '2026-09-15T08:00:00Z' }],
  },
];
