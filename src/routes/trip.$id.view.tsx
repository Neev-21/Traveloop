import { createFileRoute, useParams } from '@tanstack/react-router';
import { useState } from 'react';
import { useTrips } from '@/lib/trip-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format, eachDayOfInterval, parseISO } from 'date-fns';
import { Calendar, List, MapPin, Clock, IndianRupee } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/trip/$id/view')({ component: ViewPage });

function ViewPage() {
  const { id } = useParams({ from: '/trip/$id/view' });
  const { getTrip } = useTrips();
  const trip = getTrip(id);
  const [mode, setMode] = useState<'list' | 'calendar'>('list');
  if (!trip) return null;

  const days = eachDayOfInterval({ start: parseISO(trip.start_date), end: parseISO(trip.end_date) });
  const stopFor = (d: Date) =>
    trip.stops.find((s) => d >= parseISO(s.start_date) && d <= parseISO(s.end_date));

  return (
    <div>
      <div className="flex justify-end mb-4">
        <div className="inline-flex p-1 rounded-lg border bg-card">
          <Button size="sm" variant={mode === 'list' ? 'default' : 'ghost'} onClick={() => setMode('list')} className={mode === 'list' ? 'bg-gradient-primary' : ''}><List className="w-4 h-4" /> List</Button>
          <Button size="sm" variant={mode === 'calendar' ? 'default' : 'ghost'} onClick={() => setMode('calendar')} className={mode === 'calendar' ? 'bg-gradient-primary' : ''}><Calendar className="w-4 h-4" /> Calendar</Button>
        </div>
      </div>

      {mode === 'list' ? (
        <div className="space-y-8">
          {trip.stops.sort((a, b) => a.order_index - b.order_index).map((s, i) => (
            <div key={s.id}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-primary text-primary-foreground grid place-items-center font-bold">{i + 1}</div>
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" />{s.city_name}</h2>
                  <div className="text-xs text-muted-foreground">{s.country} • {format(parseISO(s.start_date), 'MMM d')} – {format(parseISO(s.end_date), 'MMM d')}</div>
                </div>
              </div>
              <div className="ml-5 pl-7 border-l-2 border-dashed border-border space-y-3">
                {s.activities.length === 0 && <p className="text-sm text-muted-foreground italic">No activities planned yet.</p>}
                {s.activities.map((a) => (
                  <div key={a.id} className="relative rounded-xl p-4 bg-card border shadow-card hover-lift">
                    <div className="absolute -left-[2.1rem] top-5 w-3 h-3 rounded-full bg-gradient-primary ring-4 ring-background" />
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-primary">{a.time}</div>
                        <div className="font-semibold mt-0.5">{a.name}</div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1.5 flex-wrap">
                          <Badge variant="secondary">{a.type}</Badge>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{a.duration}</span>
                          <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" />{a.cost === 0 ? 'Free' : a.cost}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {days.map((d) => {
            const s = stopFor(d);
            return (
              <div key={d.toISOString()} className={cn('rounded-2xl p-4 border bg-card shadow-card', s ? 'border-primary/30' : 'opacity-70')}>
                <div className="text-xs uppercase font-semibold text-muted-foreground">{format(d, 'EEE')}</div>
                <div className="text-xl font-bold">{format(d, 'MMM d')}</div>
                {s ? (
                  <>
                    <div className="text-sm font-medium mt-2 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-primary" />{s.city_name}</div>
                    <div className="mt-2 space-y-1">
                      {s.activities.slice(0, 3).map((a) => (
                        <div key={a.id} className="text-xs px-2 py-1 rounded bg-secondary truncate">{a.time} • {a.name}</div>
                      ))}
                    </div>
                  </>
                ) : <div className="text-xs text-muted-foreground mt-3">Free day</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
