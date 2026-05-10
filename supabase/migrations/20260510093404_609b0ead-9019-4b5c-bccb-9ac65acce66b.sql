
-- =========================
-- PROFILES
-- =========================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Traveler',
  email TEXT,
  avatar TEXT,
  language TEXT NOT NULL DEFAULT 'English',
  saved TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile select" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own profile delete" ON public.profiles FOR DELETE USING (auth.uid() = user_id);

-- =========================
-- TRIPS
-- =========================
CREATE TABLE public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  cover_photo TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
CREATE INDEX trips_user_idx ON public.trips(user_id);
CREATE POLICY "own trips select" ON public.trips FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own trips insert" ON public.trips FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own trips update" ON public.trips FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own trips delete" ON public.trips FOR DELETE USING (auth.uid() = user_id);

-- =========================
-- STOPS
-- =========================
CREATE TABLE public.stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  city_name TEXT NOT NULL,
  country TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.stops ENABLE ROW LEVEL SECURITY;
CREATE INDEX stops_trip_idx ON public.stops(trip_id);
CREATE POLICY "own stops select" ON public.stops FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own stops insert" ON public.stops FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own stops update" ON public.stops FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own stops delete" ON public.stops FOR DELETE USING (auth.uid() = user_id);

-- =========================
-- ACTIVITIES
-- =========================
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stop_id UUID NOT NULL REFERENCES public.stops(id) ON DELETE CASCADE,
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT '',
  cost NUMERIC NOT NULL DEFAULT 0,
  duration TEXT NOT NULL DEFAULT '',
  time TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
CREATE INDEX activities_stop_idx ON public.activities(stop_id);
CREATE POLICY "own activities select" ON public.activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own activities insert" ON public.activities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own activities update" ON public.activities FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own activities delete" ON public.activities FOR DELETE USING (auth.uid() = user_id);

-- =========================
-- EXPENSES
-- =========================
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  label TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (trip_id, category)
);
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own expenses select" ON public.expenses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own expenses insert" ON public.expenses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own expenses update" ON public.expenses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own expenses delete" ON public.expenses FOR DELETE USING (auth.uid() = user_id);

-- =========================
-- PACKING ITEMS
-- =========================
CREATE TABLE public.packing_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL DEFAULT 'General',
  item_name TEXT NOT NULL,
  is_packed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.packing_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own packing select" ON public.packing_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own packing insert" ON public.packing_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own packing update" ON public.packing_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own packing delete" ON public.packing_items FOR DELETE USING (auth.uid() = user_id);

-- =========================
-- NOTES
-- =========================
CREATE TABLE public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  stop_id UUID REFERENCES public.stops(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own notes select" ON public.notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own notes insert" ON public.notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own notes update" ON public.notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own notes delete" ON public.notes FOR DELETE USING (auth.uid() = user_id);

-- =========================
-- updated_at trigger
-- =========================
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_touch BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trips_touch BEFORE UPDATE ON public.trips
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =========================
-- handle_new_user: create profile + seed sample trips
-- =========================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  t1 UUID; t2 UUID; t3 UUID;
  s1 UUID; s2 UUID; s3 UUID; s4 UUID; s5 UUID; s6 UUID;
BEGIN
  INSERT INTO public.profiles (user_id, name, email, avatar)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1), 'Traveler'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/avataaars/svg?seed=' || NEW.id)
  );

  -- Trip 1: Himalayan Escape
  INSERT INTO public.trips (user_id, name, start_date, end_date, description, cover_photo)
  VALUES (NEW.id, 'Himalayan Escape', '2026-06-01', '2026-06-10',
    'A refreshing journey through the mountains and spiritual towns of North India.',
    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1600')
  RETURNING id INTO t1;

  INSERT INTO public.stops (trip_id, user_id, city_name, country, start_date, end_date, order_index)
  VALUES (t1, NEW.id, 'Manali', 'India', '2026-06-01', '2026-06-05', 0) RETURNING id INTO s1;
  INSERT INTO public.stops (trip_id, user_id, city_name, country, start_date, end_date, order_index)
  VALUES (t1, NEW.id, 'Rishikesh', 'India', '2026-06-06', '2026-06-10', 1) RETURNING id INTO s2;

  INSERT INTO public.activities (stop_id, trip_id, user_id, name, type, cost, duration, time) VALUES
    (s1, t1, NEW.id, 'Solang Valley Paragliding', 'Adventure', 2500, '3h', '10:00'),
    (s1, t1, NEW.id, 'Hadimba Temple Visit', 'Culture', 0, '1h', '15:00'),
    (s2, t1, NEW.id, 'Ganga Aarti Triveni Ghat', 'Spiritual', 0, '1h', '18:30');

  INSERT INTO public.expenses (trip_id, user_id, category, amount, label) VALUES
    (t1, NEW.id, 'transport', 18000, 'Flights & cabs'),
    (t1, NEW.id, 'stay', 24000, 'Hotels'),
    (t1, NEW.id, 'meals', 9000, 'Food'),
    (t1, NEW.id, 'activities', 7500, 'Tours');

  INSERT INTO public.packing_items (trip_id, user_id, category, item_name, is_packed) VALUES
    (t1, NEW.id, 'Clothing', 'Warm Jacket', true),
    (t1, NEW.id, 'Clothing', 'Trekking Shoes', false),
    (t1, NEW.id, 'Electronics', 'Power Bank', true),
    (t1, NEW.id, 'Documents', 'ID Proof', false);

  INSERT INTO public.notes (trip_id, user_id, content)
  VALUES (t1, NEW.id, 'Carry cash for local taxis in Manali.');

  -- Trip 2: Bali Bliss
  INSERT INTO public.trips (user_id, name, start_date, end_date, description, cover_photo)
  VALUES (NEW.id, 'Bali Bliss', '2026-09-12', '2026-09-22',
    'Tropical island getaway with beaches, temples, and rice terraces.',
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600')
  RETURNING id INTO t2;

  INSERT INTO public.stops (trip_id, user_id, city_name, country, start_date, end_date, order_index)
  VALUES (t2, NEW.id, 'Ubud', 'Indonesia', '2026-09-12', '2026-09-17', 0) RETURNING id INTO s3;
  INSERT INTO public.stops (trip_id, user_id, city_name, country, start_date, end_date, order_index)
  VALUES (t2, NEW.id, 'Seminyak', 'Indonesia', '2026-09-18', '2026-09-22', 1) RETURNING id INTO s4;

  INSERT INTO public.activities (stop_id, trip_id, user_id, name, type, cost, duration, time) VALUES
    (s3, t2, NEW.id, 'Ubud Rice Terraces', 'Nature', 1200, '5h', '09:00'),
    (s4, t2, NEW.id, 'Sunset Catamaran', 'Experience', 5500, '4h', '17:00');

  INSERT INTO public.expenses (trip_id, user_id, category, amount, label) VALUES
    (t2, NEW.id, 'transport', 65000, 'Flights'),
    (t2, NEW.id, 'stay', 48000, 'Villas'),
    (t2, NEW.id, 'meals', 18000, 'Food'),
    (t2, NEW.id, 'activities', 22000, 'Tours');

  INSERT INTO public.packing_items (trip_id, user_id, category, item_name, is_packed) VALUES
    (t2, NEW.id, 'Clothing', 'Swimwear', false),
    (t2, NEW.id, 'Clothing', 'Sun Hat', false),
    (t2, NEW.id, 'Toiletries', 'Sunscreen SPF 50', true);

  -- Trip 3: European Classics
  INSERT INTO public.trips (user_id, name, start_date, end_date, description, cover_photo)
  VALUES (NEW.id, 'European Classics', '2026-10-05', '2026-10-18',
    'Rome to Paris — history, art, and cuisine.',
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600')
  RETURNING id INTO t3;

  INSERT INTO public.stops (trip_id, user_id, city_name, country, start_date, end_date, order_index)
  VALUES (t3, NEW.id, 'Rome', 'Italy', '2026-10-05', '2026-10-10', 0) RETURNING id INTO s5;
  INSERT INTO public.stops (trip_id, user_id, city_name, country, start_date, end_date, order_index)
  VALUES (t3, NEW.id, 'Paris', 'France', '2026-10-11', '2026-10-18', 1) RETURNING id INTO s6;

  INSERT INTO public.activities (stop_id, trip_id, user_id, name, type, cost, duration, time) VALUES
    (s5, t3, NEW.id, 'Colosseum Skip-the-Line', 'Historic', 4000, '3h', '10:00'),
    (s6, t3, NEW.id, 'Eiffel Tower Summit', 'Sightseeing', 2800, '2h', '14:00');

  INSERT INTO public.expenses (trip_id, user_id, category, amount, label) VALUES
    (t3, NEW.id, 'transport', 90000, 'Flights & trains'),
    (t3, NEW.id, 'stay', 110000, 'Hotels'),
    (t3, NEW.id, 'meals', 35000, 'Restaurants'),
    (t3, NEW.id, 'activities', 28000, 'Museums & tours');

  INSERT INTO public.packing_items (trip_id, user_id, category, item_name, is_packed) VALUES
    (t3, NEW.id, 'Documents', 'Passport', true),
    (t3, NEW.id, 'Documents', 'Schengen Visa', true),
    (t3, NEW.id, 'Electronics', 'Universal Adapter', false);

  INSERT INTO public.notes (trip_id, user_id, content)
  VALUES (t3, NEW.id, 'Book Vatican tickets 2 weeks ahead.');

  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
