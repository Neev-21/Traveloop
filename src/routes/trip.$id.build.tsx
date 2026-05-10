import { createFileRoute, useParams } from '@tanstack/react-router';
import { useState } from 'react';
import { useTrips } from '@/lib/trip-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CitySearchDialog } from '@/components/city-search-dialog';
import { ActivitySearchDialog } from '@/components/activity-search-dialog';
import { ChevronUp, ChevronDown, Plus, Trash2, MapPin, Clock, IndianRupee } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export const Route = createFileRoute('/trip/$id/build')({ component: BuildPage });

function BuildPage() {
  const { id } = useParams({ from: '/trip/$id/build' });
  const { getTrip, addStop, removeStop, reorderStops, addActivity, removeActivity } = useTrips();
  const trip = getTrip(id);
  const [cityOpen, setCityOpen] = useState(false);
  const [activityFor, setActivityFor] = useState<string | null>(null);
  const [pendingCity, setPendingCity] = useState<{ name: string; country: string } | null>(null);
  const [dates, setDates] = useState({ start: '', end: '' });

  if (!trip) return null;

  const sorted = [...trip.stops].sort((a, b) => a.order_index - b.order_index);

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...sorted];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    [next[idx], next[j]] = [next[j], next[idx]];
    reorderStops(trip.id, next.map((s) => s.id));
  };

  const onAddStop = () => {
    if (!pendingCity || !dates.start || !dates.end) return toast.error('Pick a city and dates');
    addStop(trip.id, { city_name: pendingCity.name, country: pendingCity.country, start_date: dates.start, end_date: dates.end });
    setPendingCity(null); setDates({ start: '', end: '' });
    toast.success('Stop added');
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[1fr_360px] gap-6">
      {/* Add a Stop panel — shown at top on mobile, right side on desktop */}
      <aside className="lg:order-2 rounded-2xl glass-strong p-5 h-fit lg:sticky lg:top-6">
        <h3 className="font-bold">Add a Stop</h3>
        <p className="text-xs text-muted-foreground">Search a city, set dates, then add to itinerary.</p>
        <Button onClick={() => setCityOpen(true)} variant="outline" className="w-full mt-3">
          <MapPin className="w-4 h-4" /> {pendingCity ? `${pendingCity.name}, ${pendingCity.country}` : 'Search Cities'}
        </Button>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <Input type="date" value={dates.start} onChange={(e) => setDates((p) => ({ ...p, start: e.target.value }))} />
          <Input type="date" value={dates.end} onChange={(e) => setDates((p) => ({ ...p, end: e.target.value }))} />
        </div>
        <Button onClick={onAddStop} className="w-full mt-3 bg-gradient-primary"><Plus className="w-4 h-4" /> Add to Trip</Button>
      </aside>

      <div className="lg:order-1 space-y-4">
        {sorted.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed p-12 text-center">
            <MapPin className="w-10 h-10 text-muted-foreground mx-auto" />
            <p className="mt-3 text-muted-foreground">No stops yet. Add your first city to get started.</p>
          </div>
        )}
        {sorted.map((s, i) => (
          <div key={s.id} className="rounded-2xl border bg-card shadow-card overflow-hidden">
            <div className="p-4 flex items-center gap-3 bg-gradient-to-r from-secondary/50 to-transparent">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary text-primary-foreground grid place-items-center font-bold">{i + 1}</div>
              <div className="flex-1 min-w-0">
                <div className="font-bold">{s.city_name}, <span className="text-muted-foreground font-normal">{s.country}</span></div>
                <div className="text-xs text-muted-foreground">{s.start_date} → {s.end_date}</div>
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => move(i, -1)} disabled={i === 0}><ChevronUp className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => move(i, 1)} disabled={i === sorted.length - 1}><ChevronDown className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => removeStop(trip.id, s.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </div>
            <div className="p-4 space-y-2">
              {s.activities.map((a) => (
                <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/40">
                  <div className="w-9 h-9 rounded-lg bg-gradient-sunset text-primary-foreground grid place-items-center text-xs font-bold">{a.time}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{a.name}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="secondary" className="text-[10px]">{a.type}</Badge>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{a.duration}</span>
                      <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" />{a.cost}</span>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => removeActivity(trip.id, s.id, a.id)}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
                </div>
              ))}
              <Button size="sm" variant="outline" className="w-full" onClick={() => setActivityFor(s.id)}>
                <Plus className="w-4 h-4" /> Add Activity
              </Button>
            </div>
          </div>
        ))}
      </div>

      <CitySearchDialog open={cityOpen} onOpenChange={setCityOpen} onPick={setPendingCity} />
      <ActivitySearchDialog
        open={!!activityFor}
        onOpenChange={(o) => !o && setActivityFor(null)}
        onPick={(a) => { if (activityFor) addActivity(trip.id, activityFor, a); toast.success('Activity added'); }}
      />
    </div>
  );
}
