export type University = {
  id: string;
  name: string;
  city: string;
  country: string;
  website: string | null;
  logo: string | null;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  verified: boolean;
  created_at: string;
};

export type Business = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  subcategory: string | null;
  address: string | null;
  city: string;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  website: string | null;
  instagram: string | null;
  image: string | null;
  verified: boolean;
  rating: number | null;
  veg: boolean | null;
  price_range: string | null;
  created_at: string;
};

export type EventItem = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  date: string;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  image: string | null;
  organizer_id: string | null;
  organizer_name: string | null;
  external_link: string | null;
  contact: string | null;
  status: string;
  created_at: string;
};

export type Organization = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  website: string | null;
  instagram: string | null;
  facebook: string | null;
  contact: string | null;
  city: string;
  logo: string | null;
  verified: boolean;
  created_at: string;
};

export type Announcement = {
  id: string;
  title: string;
  description: string | null;
  source: string;
  date: string;
  image: string | null;
  external_link: string | null;
  status: string;
  created_at: string;
};

export type UserProfile = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  city: string | null;
  university_id: string | null;
  program: string | null;
  year: string | null;
  semester: string | null;
  profile_image: string | null;
  is_admin: boolean;
  created_at: string;
};

export type SavedItem = {
  id: string;
  user_id: string;
  item_type: string;
  item_id: string;
  created_at: string;
};

export type BusinessCategory =
  | 'restaurant'
  | 'cafe'
  | 'tiffin'
  | 'grocery'
  | 'sweets'
  | 'services'
  | 'hotel'
  | 'university'
  | 'organization'
  | 'doctor'
  | 'travel'
  | 'cricket'
  | 'event';

export const BUSINESS_CATEGORIES: { value: string; label: string; icon: string }[] = [
  { value: 'restaurant', label: 'Indian Restaurants', icon: '🍛' },
  { value: 'cafe', label: 'Indian Cafes', icon: '☕' },
  { value: 'services', label: 'Indian Barbers', icon: '💈' },
  { value: 'grocery', label: 'Indian Grocery', icon: '🛒' },
  { value: 'hotel', label: 'Hotels', icon: '🏨' },
  { value: 'university', label: 'Universities', icon: '🎓' },
  { value: 'organization', label: 'Organizations', icon: '🤝' },
  { value: 'cricket', label: 'Cricket', icon: '🏏' },
  { value: 'event', label: 'Events', icon: '🎉' },
  { value: 'doctor', label: 'Indian Doctors', icon: '🩺' },
  { value: 'travel', label: 'Travel Services', icon: '✈️' },
  { value: 'tiffin', label: 'Tiffin', icon: '🍱' },
  { value: 'sweets', label: 'Indian Sweets', icon: '🍮' },
];

export const EVENT_CATEGORIES = [
  'Cultural', 'Bollywood', 'Cricket', 'Student', 'Food',
  'Religious', 'Networking', 'Party', 'Community', 'Business',
];

export const CITIES = ['Tbilisi', 'Batumi', 'Kutaisi', 'Other'];

export const PROGRAMS = [
  'Medicine', 'Dentistry', 'Business Administration', 'Computer Science',
  'Information Technology', 'Law', 'Pharmacy', 'Nursing',
  'International Relations', 'Economics', 'Other',
];

export const YEARS = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6'];

export const SEMESTERS = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6'];

export const FOOD_CUISINES = [
  'North Indian', 'South Indian', 'Punjabi', 'Gujarati', 'Bengali',
  'Vegetarian', 'Vegan', 'Halal', 'Tiffin',
];
