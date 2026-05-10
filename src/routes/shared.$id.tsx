import { createFileRoute, useParams, Link } from '@tanstack/react-router';
import { useTrips } from '@/lib/trip-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Compass, Copy, Twitter, Facebook, Link as LinkIcon, Clock, IndianRupee } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';

export const Route = createFileRoute('/shared/$id')({ component: SharedTrip });

function SharedTrip() {
  const { id } = useParams({ from: '/shared/$id' });
  const { getTrip } = useTrips();
  const trip = getTrip(id);

  if (!trip) return (
    <div className="min-h-screen grid place-items-center bg-mesh p-6">
      <div className="text-center glass-strong rounded-3xl p-10">
        <h2 className="text-xl font-bold">Trip not found</h2>
        <Link to="/" className="text-primary mt-4 inline-block">Back home</Link>
      </div>
    </div>
  );

  const total = trip.expenses.reduce((s, e) => s + e.amount, 0);
  const copy = () => { navigator.clipboard?.writeText(window.location.href); toast.success('Link copied'); };

  return (
    <div className="min-h-screen bg-mesh">
      <header className="glass-strong border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/favicon.png" alt="Traveloop" className="w-8 h-8 rounded-lg object-contain" />
            <span className="font-bold">Traveloop</span>
          </Link>
          <Link to="/create"><Button size="sm" className="bg-gradient-primary">Copy Trip</Button></Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        <div className="rounded-3xl overflow-hidden shadow-soft mb-6 relative h-64 sm:h-80">
          <img src={trip.cover_photo} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <Badge className="bg-white/20 backdrop-blur border-white/30 text-white">Shared Itinerary</Badge>
            <h1 className="text-3xl sm:text-4xl font-bold mt-2">{trip.name}</h1>
            <div className="flex items-center gap-4 text-sm mt-2 opacity-90">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{format(parseISO(trip.start_date), 'MMM d')} – {format(parseISO(trip.end_date), 'MMM d, yyyy')}</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{trip.stops.length} stops</span>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground">{trip.description}</p>

        <div className="flex flex-wrap items-center gap-2 mt-4 mb-8">
          <Button onClick={copy} variant="outline" size="sm"><LinkIcon className="w-4 h-4" /> Copy link</Button>
          <Button variant="outline" size="sm" onClick={() => window.open(`https://twitter.com/intent/tweet?text=Check out ${trip.name}&url=${encodeURIComponent(window.location.href)}`)}><Twitter className="w-4 h-4" /> Tweet</Button>
          <Button variant="outline" size="sm" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`)}><Facebook className="w-4 h-4" /> Share</Button>
          <span className="ml-auto text-sm text-muted-foreground">Total: <b className="text-foreground">₹{total.toLocaleString()}</b></span>
        </div>

        <div className="space-y-8">
          {trip.stops.sort((a, b) => a.order_index - b.order_index).map((s, i) => (
            <div key={s.id}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-primary text-primary-foreground grid place-items-center font-bold">{i + 1}</div>
                <div>
                  <h2 className="text-xl font-bold">{s.city_name}, <span className="text-muted-foreground font-normal">{s.country}</span></h2>
                  <div className="text-xs text-muted-foreground">{format(parseISO(s.start_date), 'MMM d')} – {format(parseISO(s.end_date), 'MMM d')}</div>
                </div>
              </div>
              <div className="ml-5 pl-7 border-l-2 border-dashed space-y-3">
                {s.activities.map((a) => (
                  <div key={a.id} className="relative rounded-xl p-4 bg-card border shadow-card">
                    <div className="absolute -left-[2.1rem] top-5 w-3 h-3 rounded-full bg-gradient-primary ring-4 ring-background" />
                    <div className="text-xs font-semibold text-primary">{a.time}</div>
                    <div className="font-semibold">{a.name}</div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <Badge variant="secondary">{a.type}</Badge>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{a.duration}</span>
                      <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" />{a.cost === 0 ? 'Free' : a.cost}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
