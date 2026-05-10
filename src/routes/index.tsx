import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { AppLayout } from '@/components/app-layout';
import { TripCard } from '@/components/trip-card';
import { StatCard } from '@/components/stat-card';
import { useTrips } from '@/lib/trip-context';
import { POPULAR_CITIES } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Plane, Wallet, MapPin, Sparkles, ArrowRight } from 'lucide-react';

export const Route = createFileRoute('/')({ component: Dashboard });

function Dashboard() {
  const { trips, user } = useTrips();
  const navigate = useNavigate();
  const upcoming = trips.filter((t) => new Date(t.end_date) >= new Date()).slice(0, 3);
  const totalBudget = trips.reduce((s, t) => s + t.expenses.reduce((a, e) => a + e.amount, 0), 0);
  const totalStops = trips.reduce((s, t) => s + t.stops.length, 0);

  return (
    <AppLayout>
      {/* Hero */}
      <div className="rounded-3xl p-6 sm:p-10 bg-gradient-primary animate-gradient text-primary-foreground shadow-glow relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-mesh" />
        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-medium backdrop-blur"><Sparkles className="w-3 h-3" /> Welcome back</div>
          <h1 className="text-3xl sm:text-4xl font-bold mt-3 leading-tight">Hello, {user.name.split(' ')[0]} 👋<br/>Ready for your next adventure?</h1>
          <p className="mt-2 opacity-90">Plan smarter, travel further. Build itineraries, track budgets, and share with friends.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={() => navigate({ to: '/create' })} className="bg-white text-primary hover:bg-white/90">Plan New Trip</Button>
            <Link to="/trips"><Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">View Trips</Button></Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
        <StatCard label="Trips Planned" value={trips.length} icon={<Plane className="w-5 h-5" />} gradient="primary" />
        <StatCard label="Cities" value={totalStops} icon={<MapPin className="w-5 h-5" />} gradient="ocean" />
        <StatCard label="Total Budget" value={`₹${(totalBudget/1000).toFixed(0)}k`} icon={<Wallet className="w-5 h-5" />} gradient="sunset" />
        <StatCard label="Saved Cities" value={user.saved.length} icon={<Sparkles className="w-5 h-5" />} gradient="forest" />
      </div>

      {/* Upcoming */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Upcoming Trips</h2>
          <Link to="/trips" className="text-sm text-primary font-medium flex items-center gap-1">View all <ArrowRight className="w-4 h-4" /></Link>
        </div>
        {upcoming.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map((t) => <TripCard key={t.id} trip={t} />)}
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed p-10 text-center text-muted-foreground">
            No upcoming trips. <Link to="/create" className="text-primary font-medium">Plan one</Link>.
          </div>
        )}
      </section>

      {/* Popular */}
      <section className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Trending Destinations</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {POPULAR_CITIES.slice(0, 6).map((c) => (
            <div key={c.name} className="relative rounded-2xl overflow-hidden aspect-[3/4] hover-lift cursor-pointer group">
              <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 p-3 text-white">
                <div className="font-bold text-sm">{c.name}</div>
                <div className="text-[10px] opacity-80">{c.country}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
