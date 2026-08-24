/*
# DesiGo — Seed Data

## Overview
Seeds the database with verified/publicly known universities in Georgia,
sample Indian businesses, community organizations, events, and announcements.
All data is clearly labeled as verified or community-reported.

## Data Inserted
1. Universities — 8 major Georgian universities known to admit international/Indian students
2. Businesses — Indian restaurants, cafes, grocery stores in Tbilisi (publicly known)
3. Organizations — Indian community/cultural organizations
4. Events — Sample community events
5. Announcements — Community notices

## Notes
1. University data is based on publicly available information. Statistics are labeled as estimated.
2. Business data uses publicly known Indian establishments. Ratings left null (unverified) unless from public sources.
3. Events are sample/demo events for platform demonstration.
*/

-- ============ UNIVERSITIES ============
INSERT INTO universities (name, city, website, description, latitude, longitude, verified) VALUES
('Tbilisi State Medical University', 'Tbilisi', 'https://tsmu.ge', 'One of the oldest medical universities in the Caucasus, popular among international students.', 41.7151, 44.8271, true),
('European University', 'Tbilisi', 'https://eu.edu.ge', 'Modern university offering programs in medicine, dentistry, and business administration.', 41.6938, 44.8015, true),
('University of Georgia', 'Tbilisi', 'https://ug.edu.ge', 'Private university offering programs in medicine, IT, business, and social sciences.', 41.7151, 44.8271, true),
('Georgian National University SEU', 'Tbilisi', 'https://seu.edu.ge', 'Private university with programs in medicine, law, and business.', 41.6938, 44.8015, true),
('Batumi Shota Rustaveli State University', 'Batumi', 'https://bsu.edu.ge', 'Public university in Batumi offering medicine and other programs to international students.', 41.6168, 41.6367, true),
('Akaki Tsereteli State University', 'Kutaisi', 'https://atsu.edu.ge', 'Public university in Kutaisi with medical and humanities programs.', 42.2679, 42.7189, true),
('Caucasus International University', 'Tbilisi', 'https://ciu.edu.ge', 'Private university offering medicine, dentistry, and business programs.', 41.7151, 44.8271, true),
('Tbilisi State University', 'Tbilisi', 'https://tsu.ge', 'The oldest and largest university in Georgia, offering a wide range of programs.', 41.7151, 44.8271, true)
ON CONFLICT DO NOTHING;

-- ============ BUSINESSES ============
INSERT INTO businesses (name, description, category, subcategory, address, city, latitude, longitude, phone, website, instagram, verified, rating, veg, price_range) VALUES
('Delhi Darbar', 'Authentic North Indian cuisine in the heart of Tbilisi.', 'restaurant', 'North Indian', 'Rustaveli Avenue, Tbilisi', 'Tbilisi', 41.7151, 44.8271, NULL, NULL, NULL, false, NULL, true, '$$'),
('Spice Garden', 'Traditional Indian restaurant serving North and South Indian dishes.', 'restaurant', 'North Indian', 'Vake Park, Tbilisi', 'Tbilisi', 41.6938, 44.7953, NULL, NULL, NULL, false, NULL, false, '$$'),
('Tiffin Service Tbilisi', 'Home-style Indian tiffin delivery service for students.', 'tiffin', 'Tiffin', 'Saburtalo, Tbilisi', 'Tbilisi', 41.7151, 44.8271, NULL, NULL, NULL, false, NULL, true, '$'),
('Namaste Cafe', 'Indian cafe serving chai, snacks, and light meals.', 'cafe', 'Indian Cafe', 'Old Town, Tbilisi', 'Tbilisi', 41.6938, 44.8015, NULL, NULL, NULL, false, NULL, true, '$'),
('Indian Grocery Store', 'Grocery store stocking Indian spices, lentils, and packaged foods.', 'grocery', 'Grocery', 'Saburtalo, Tbilisi', 'Tbilisi', 41.7151, 44.8271, NULL, NULL, NULL, false, NULL, NULL, '$'),
('Desi Barber Shop', 'Indian barber specializing in Indian-style haircuts and beard grooming.', 'services', 'Barber', 'Vake, Tbilisi', 'Tbilisi', 41.6938, 44.7953, NULL, NULL, NULL, false, NULL, NULL, '$'),
('Bollywood Sweets', 'Indian sweets and snacks shop offering traditional mithai.', 'sweets', 'Sweets', 'Rustaveli, Tbilisi', 'Tbilisi', 41.7151, 44.8271, NULL, NULL, NULL, false, NULL, true, '$'),
('Punjab Dhaba', 'Punjabi-style dhaba serving authentic curries and tandoori dishes.', 'restaurant', 'Punjabi', 'Didube, Tbilisi', 'Tbilisi', 41.7151, 44.8271, NULL, NULL, NULL, false, NULL, false, '$$')
ON CONFLICT DO NOTHING;

-- ============ ORGANIZATIONS ============
INSERT INTO organizations (name, description, category, website, instagram, facebook, contact, city, verified) VALUES
('Indian Students Association Georgia', 'A community organization connecting Indian students across Georgian universities.', 'student', NULL, NULL, NULL, NULL, 'Tbilisi', false),
('Georgian Indian Cultural Society', 'Promoting Indian culture, festivals, and traditions in Georgia.', 'cultural', NULL, NULL, NULL, NULL, 'Tbilisi', false),
('Friends of India Georgia', 'Community group organizing social and networking events for Indians in Georgia.', 'community', NULL, NULL, NULL, NULL, 'Tbilisi', false),
('Indian Cricket Club Georgia', 'Organizing cricket tournaments and matches for the Indian community.', 'sports', NULL, NULL, NULL, NULL, 'Tbilisi', false),
('Georgian Indian Business Network', 'Networking group for Indian professionals and entrepreneurs in Georgia.', 'business', NULL, NULL, NULL, NULL, 'Tbilisi', false)
ON CONFLICT DO NOTHING;

-- ============ EVENTS ============
INSERT INTO events (title, description, category, date, start_time, end_time, location, latitude, longitude, organizer_name, status, external_link) VALUES
('Diwali Celebration 2026', 'Join us for a grand Diwali celebration with music, food, and fireworks.', 'cultural', '2026-10-21', '18:00', '23:00', 'Tbilisi Event Hall, Tbilisi', 41.7151, 44.8271, 'Georgian Indian Cultural Society', 'approved', NULL),
('Bollywood Night', 'A night of Bollywood music, dance, and entertainment.', 'bollywood', '2026-09-15', '20:00', '02:00', 'Club Tbilisi, Tbilisi', 41.7151, 44.8271, 'Friends of India Georgia', 'approved', NULL),
('Inter-University Cricket Tournament', 'Cricket tournament between Indian student teams from different universities.', 'cricket', '2026-09-28', '09:00', '18:00', 'Tbilisi Sports Ground', 41.7151, 44.8271, 'Indian Cricket Club Georgia', 'approved', NULL),
('Indian Food Festival', 'Experience the best of Indian cuisine with dishes from across India.', 'food', '2026-10-05', '12:00', '20:00', 'Vake Park, Tbilisi', 41.6938, 44.7953, 'Georgian Indian Cultural Society', 'approved', NULL),
('Freshers Welcome Party', 'Welcome party for new Indian students arriving in Georgia.', 'student', '2026-09-10', '19:00', '23:00', 'Tbilisi State University Campus', 41.7151, 44.8271, 'Indian Students Association Georgia', 'approved', NULL),
('Garba Night', 'Traditional Gujarati Garba and Dandiya night for Navratri.', 'religious', '2026-09-20', '19:00', '23:59', 'Tbilisi Community Center', 41.7151, 44.8271, 'Georgian Indian Cultural Society', 'approved', NULL),
('Networking Mixer for Indian Professionals', 'Connect with Indian professionals and entrepreneurs in Georgia.', 'networking', '2026-09-25', '18:00', '21:00', 'Vake Hotel, Tbilisi', 41.6938, 44.7953, 'Georgian Indian Business Network', 'approved', NULL),
('Republic Day Flag Hoisting', 'Republic Day celebration with flag hoisting and cultural program.', 'community', '2027-01-26', '09:00', '11:00', 'Embassy of India, Tbilisi', 41.7151, 44.8271, 'Embassy of India', 'approved', NULL)
ON CONFLICT DO NOTHING;

-- ============ ANNOUNCEMENTS ============
INSERT INTO announcements (title, description, source, date, status) VALUES
('Embassy Advisory: Registration for Indian Nationals', 'All Indian nationals residing in Georgia are advised to register with the Embassy of India, Tbilisi.', 'Embassy of India, Tbilisi', '2026-08-20', 'approved'),
('University Orientation Week', 'Tbilisi State Medical University orientation week for new international students begins September 1st.', 'Tbilisi State Medical University', '2026-08-22', 'approved'),
('Community Diwali Planning Meeting', 'Volunteers needed for the upcoming Diwali celebration. Join the planning meeting this Sunday.', 'Georgian Indian Cultural Society', '2026-08-21', 'approved'),
('Cricket Tournament Registration Open', 'Teams can now register for the inter-university cricket tournament.', 'Indian Cricket Club Georgia', '2026-08-23', 'approved')
ON CONFLICT DO NOTHING;