import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { TripCard } from '@/components/trip-card';
import { useTrips } from '@/lib/trip-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, LayoutGrid, List as ListIcon } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export const Route = createFileRoute('/trips')({ component: TripsList });

function TripsList() {
  const { trips, deleteTrip } = useTrips();
  const [q, setQ] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const filtered = trips.filter((t) => t.name.toLowerCase().includes(q.toLowerCase()));

  const onDelete = (id: string) => { deleteTrip(id); toast.success('Trip deleted'); };

  return (
    <AppLayout>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Trips</h1>
          <p className="text-muted-foreground text-sm">Manage and explore your adventures.</p>
        </div>
        <Link to="/create"><Button className="bg-gradient-primary shadow-glow"><Plus className="w-4 h-4" /> New Trip</Button></Link>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search trips…" className="pl-9" />
        </div>
        <div className="flex gap-1 p-1 rounded-lg border bg-card">
          <button onClick={() => setView('grid')} className={`p-2 rounded-md ${view === 'grid' ? 'bg-secondary' : ''}`}><LayoutGrid className="w-4 h-4" /></button>
          <button onClick={() => setView('list')} className={`p-2 rounded-md ${view === 'list' ? 'bg-secondary' : ''}`}><ListIcon className="w-4 h-4" /></button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed p-16 text-center">
          <p className="text-muted-foreground">No trips found.</p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t) => <TripCard key={t.id} trip={t} onDelete={onDelete} />)}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((t) => (
            <div key={t.id} className="flex items-center gap-4 p-3 rounded-2xl border bg-card hover-lift">
              <img src={t.cover_photo} className="w-20 h-20 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{t.name}</div>
                <div className="text-xs text-muted-foreground">{format(new Date(t.start_date), 'MMM d')} – {format(new Date(t.end_date), 'MMM d, yyyy')} • {t.stops.length} stops</div>
              </div>
              <Link to="/trip/$id/view" params={{ id: t.id }}><Button size="sm" variant="outline">View</Button></Link>
              <Link to="/trip/$id/build" params={{ id: t.id }}><Button size="sm" className="bg-gradient-primary">Plan</Button></Link>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
