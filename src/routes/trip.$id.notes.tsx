import { createFileRoute, useParams } from '@tanstack/react-router';
import { useState } from 'react';
import { useTrips } from '@/lib/trip-context';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, StickyNote } from 'lucide-react';
import { format } from 'date-fns';

export const Route = createFileRoute('/trip/$id/notes')({ component: NotesPage });

function NotesPage() {
  const { id } = useParams({ from: '/trip/$id/notes' });
  const { getTrip, addNote, removeNote } = useTrips();
  const trip = getTrip(id);
  const [content, setContent] = useState('');
  const [stop, setStop] = useState<string>('general');
  if (!trip) return null;

  const sorted = [...trip.notes].sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    addNote(trip.id, content.trim(), stop === 'general' ? undefined : stop);
    setContent('');
  };

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-6">
      <div className="space-y-3">
        {sorted.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed p-12 text-center">
            <StickyNote className="w-10 h-10 text-muted-foreground mx-auto" />
            <p className="mt-3 text-muted-foreground">Capture ideas, reminders, and tips for your trip.</p>
          </div>
        )}
        {sorted.map((n) => {
          const stopName = trip.stops.find((s) => s.id === n.stop_id)?.city_name;
          return (
            <div key={n.id} className="rounded-2xl border bg-card p-4 shadow-card group hover-lift">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-muted-foreground">
                  {format(new Date(n.timestamp), 'PPp')} {stopName && <span className="text-primary">• {stopName}</span>}
                </div>
                <button onClick={() => removeNote(trip.id, n.id)} className="opacity-0 group-hover:opacity-100 text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="text-sm whitespace-pre-wrap">{n.content}</div>
            </div>
          );
        })}
      </div>

      <form onSubmit={submit} className="rounded-2xl glass-strong p-5 h-fit lg:sticky lg:top-6">
        <h3 className="font-bold">New Note</h3>
        <Select value={stop} onValueChange={setStop}>
          <SelectTrigger className="mt-3"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General trip note</SelectItem>
            {trip.stops.map((s) => <SelectItem key={s.id} value={s.id}>{s.city_name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} placeholder="Write something to remember…" className="mt-3" />
        <Button type="submit" className="w-full mt-3 bg-gradient-primary">Add Note</Button>
      </form>
    </div>
  );
}
