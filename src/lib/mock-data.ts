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
  // India
  { name: 'Manali', country: 'India', cost_index: 38, popularity: 92, image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', tag: 'Mountains' },
  { name: 'Jaipur', country: 'India', cost_index: 35, popularity: 88, image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800', tag: 'Heritage' },
  { name: 'Kerala', country: 'India', cost_index: 42, popularity: 95, image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800', tag: 'Backwaters' },
  { name: 'Mumbai', country: 'India', cost_index: 55, popularity: 90, image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800', tag: 'Metro' },
  { name: 'Rishikesh', country: 'India', cost_index: 30, popularity: 82, image: 'https://images.unsplash.com/photo-1561361398-a1d6cf5b1963?w=800', tag: 'Spiritual' },
  { name: 'Goa', country: 'India', cost_index: 48, popularity: 96, image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800', tag: 'Beach' },
  { name: 'Shimla', country: 'India', cost_index: 40, popularity: 85, image: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=800', tag: 'Hill Station' },
  { name: 'Darjeeling', country: 'India', cost_index: 35, popularity: 80, image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800', tag: 'Tea & Hills' },
  { name: 'Varanasi', country: 'India', cost_index: 28, popularity: 87, image: 'https://images.unsplash.com/photo-1561361513-2d000a50f396?w=800', tag: 'Spiritual' },
  { name: 'Agra', country: 'India', cost_index: 32, popularity: 93, image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800', tag: 'Heritage' },
  { name: 'Delhi', country: 'India', cost_index: 50, popularity: 92, image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', tag: 'Metro' },
  { name: 'Bengaluru', country: 'India', cost_index: 52, popularity: 88, image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800', tag: 'Tech City' },
  { name: 'Hyderabad', country: 'India', cost_index: 48, popularity: 86, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', tag: 'Heritage' },
  { name: 'Kolkata', country: 'India', cost_index: 38, popularity: 82, image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=800', tag: 'Cultural' },
  { name: 'Puducherry', country: 'India', cost_index: 35, popularity: 78, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800', tag: 'French Town' },
  { name: 'Ooty', country: 'India', cost_index: 32, popularity: 75, image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800', tag: 'Hill Station' },
  { name: 'Spiti Valley', country: 'India', cost_index: 45, popularity: 77, image: 'https://images.unsplash.com/photo-1596627116790-af6f46dddbfd?w=800', tag: 'Adventure' },
  { name: 'Andaman Islands', country: 'India', cost_index: 65, popularity: 88, image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f0e?w=800', tag: 'Beach' },
  { name: 'Coorg', country: 'India', cost_index: 38, popularity: 80, image: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=800', tag: 'Coffee & Hills' },
  { name: 'Leh Ladakh', country: 'India', cost_index: 55, popularity: 90, image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800', tag: 'High Altitude' },
  { name: 'Ranthambore', country: 'India', cost_index: 60, popularity: 76, image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=800', tag: 'Wildlife' },
  // International
  { name: 'Bali', country: 'Indonesia', cost_index: 52, popularity: 98, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', tag: 'Tropical' },
  { name: 'Tokyo', country: 'Japan', cost_index: 88, popularity: 97, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', tag: 'City' },
  { name: 'Rome', country: 'Italy', cost_index: 78, popularity: 94, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800', tag: 'Historic' },
  { name: 'New York', country: 'USA', cost_index: 95, popularity: 99, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800', tag: 'Metro' },
  { name: 'Paris', country: 'France', cost_index: 82, popularity: 96, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', tag: 'Romantic' },
  { name: 'Santorini', country: 'Greece', cost_index: 75, popularity: 93, image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800', tag: 'Island' },
  { name: 'Bangkok', country: 'Thailand', cost_index: 45, popularity: 95, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c8dd0d5?w=800', tag: 'City' },
  { name: 'Singapore', country: 'Singapore', cost_index: 90, popularity: 96, image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800', tag: 'City-State' },
  { name: 'Dubai', country: 'UAE', cost_index: 98, popularity: 97, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', tag: 'Luxury' },
  { name: 'Barcelona', country: 'Spain', cost_index: 72, popularity: 93, image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800', tag: 'City Beach' },
  { name: 'Amsterdam', country: 'Netherlands', cost_index: 80, popularity: 91, image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800', tag: 'Canals' },
  { name: 'London', country: 'UK', cost_index: 92, popularity: 97, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800', tag: 'Historic' },
  { name: 'Kyoto', country: 'Japan', cost_index: 82, popularity: 94, image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800', tag: 'Temples' },
  { name: 'Maldives', country: 'Maldives', cost_index: 150, popularity: 96, image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800', tag: 'Island' },
  { name: 'Nepal', country: 'Nepal', cost_index: 35, popularity: 88, image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800', tag: 'Himalaya' },
  { name: 'Sri Lanka', country: 'Sri Lanka', cost_index: 40, popularity: 87, image: 'https://images.unsplash.com/photo-1586861203927-800a5acdcc4d?w=800', tag: 'Island' },
  { name: 'Phuket', country: 'Thailand', cost_index: 55, popularity: 92, image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800', tag: 'Beach' },
  { name: 'Istanbul', country: 'Turkey', cost_index: 60, popularity: 90, image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800', tag: 'Historic' },
  { name: 'Prague', country: 'Czech Republic', cost_index: 62, popularity: 89, image: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800', tag: 'Historic' },
  { name: 'Vienna', country: 'Austria', cost_index: 75, popularity: 88, image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800', tag: 'Imperial' },
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
