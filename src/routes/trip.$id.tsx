import { createFileRoute, Outlet, Link, useRouterState, useParams, useNavigate } from '@tanstack/react-router';
import { AppLayout } from '@/components/app-layout';
import { useTrips } from '@/lib/trip-context';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Share2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/trip/$id')({ component: TripLayout });

const TABS = [
  { to: 'build' as const, label: 'Builder' },
  { to: 'view' as const, label: 'Itinerary' },
  { to: 'budget' as const, label: 'Budget' },
  { to: 'packing' as const, label: 'Packing' },
  { to: 'notes' as const, label: 'Notes' },
];

function TripLayout() {
  const { id } = useParams({ from: '/trip/$id' });
  const { getTrip } = useTrips();
  const navigate = useNavigate();
  const trip = getTrip(id);
  const path = useRouterState({ select: (r) => r.location.pathname });

  if (!trip) {
    return (
      <AppLayout>
        <div className="text-center py-20">
          <h2 className="text-xl font-bold">Trip not found</h2>
          <Button onClick={() => navigate({ to: '/trips' })} className="mt-4">Back to trips</Button>
        </div>
      </AppLayout>
    );
  }

  const share = () => {
    const url = `${window.location.origin}/shared/${trip.id}`;
    navigator.clipboard?.writeText(url);
    toast.success('Share link copied!');
  };

  return (
    <AppLayout>
      <div className="rounded-3xl overflow-hidden shadow-soft mb-6 relative">
        <div className="h-44 sm:h-56 relative">
          <img src={trip.cover_photo} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <Link to="/trips" className="absolute top-4 left-4 glass rounded-full p-2 text-white"><ArrowLeft className="w-4 h-4" /></Link>
          <div className="absolute bottom-4 left-4 right-4 text-white flex items-end justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">{trip.name}</h1>
              <div className="flex items-center gap-3 text-xs sm:text-sm mt-1 opacity-90">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{format(new Date(trip.start_date), 'MMM d')} – {format(new Date(trip.end_date), 'MMM d')}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{trip.stops.length} stops</span>
              </div>
            </div>
            <Button onClick={share} size="sm" className="bg-white/20 backdrop-blur hover:bg-white/30 text-white border border-white/30"><Share2 className="w-4 h-4" /> Share</Button>
          </div>
        </div>
      </div>

      <div className="flex gap-1 p-1 rounded-xl glass mb-6 overflow-x-auto">
        {TABS.map((t) => {
          const active = path.endsWith(`/${t.to}`);
          return (
            <Link
              key={t.to}
              {...({ to: `/trip/$id/${t.to}`, params: { id: trip.id } } as any)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
                active ? 'bg-gradient-primary text-primary-foreground shadow-glow' : 'hover:bg-secondary text-foreground/70',
              )}
            >
              {t.label}
            </Link>
          );
        })}
      </div>

      <Outlet />
    </AppLayout>
  );
}
