import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTrips } from '@/lib/trip-context';
import { POPULAR_CITIES } from '@/lib/mock-data';
import { toast } from 'sonner';
import { ImageIcon } from 'lucide-react';

export const Route = createFileRoute('/create')({ component: CreateTrip });

function CreateTrip() {
  const { addTrip } = useTrips();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [desc, setDesc] = useState('');
  const [cover, setCover] = useState(POPULAR_CITIES[0].image);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !start || !end) return toast.error('Fill name and dates');
    if (new Date(end) < new Date(start)) return toast.error('End date must be after start');
    const id = addTrip({ name, start_date: start, end_date: end, description: desc, cover_photo: cover });
    toast.success('Trip created!');
    navigate({ to: '/trip/$id/build', params: { id } });
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold">Plan a New Trip</h1>
        <p className="text-muted-foreground mt-1">Start with the basics — you can add stops, activities, and budgets next.</p>

        <form onSubmit={submit} className="mt-6 glass-strong rounded-3xl p-6 sm:p-8 shadow-soft space-y-5">
          <div>
            <Label htmlFor="name">Trip Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Bali Bliss 2026" className="mt-1" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start">Start Date</Label>
              <Input id="start" type="date" value={start} onChange={(e) => setStart(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="end">End Date</Label>
              <Input id="end" type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="mt-1" />
            </div>
          </div>
          <div>
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="What's this trip about?" className="mt-1" rows={3} />
          </div>
          <div>
            <Label className="flex items-center gap-1"><ImageIcon className="w-4 h-4" /> Cover Photo</Label>
            {/* Preview */}
            {cover && <img src={cover} alt="cover preview" className="mt-2 w-full h-32 object-cover rounded-xl mb-2" onError={(e) => (e.currentTarget.style.display = 'none')} />}
            {/* Preset thumbnails */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-2">
              {POPULAR_CITIES.slice(0, 6).map((c) => (
                <button type="button" key={c.name} onClick={() => setCover(c.image)} className={`relative aspect-square rounded-xl overflow-hidden ring-2 transition-all ${cover === c.image ? 'ring-primary shadow-glow' : 'ring-transparent'}`}>
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            {/* Custom URL */}
            <div className="mt-3 flex gap-2">
              <Input
                id="cover-url"
                placeholder="Or paste an image URL…"
                onBlur={(e) => { if (e.target.value.trim()) setCover(e.target.value.trim()); }}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); const v = (e.target as HTMLInputElement).value.trim(); if (v) setCover(v); } }}
                className="flex-1 text-sm"
              />
            </div>
            {/* File upload */}
            <label className="mt-2 flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground">
              <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) { const url = URL.createObjectURL(file); setCover(url); }
              }} />
              <span className="px-3 py-1.5 rounded-lg border text-xs hover:bg-secondary transition-colors">📁 Upload from device</span>
            </label>
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => navigate({ to: '/trips' })}>Cancel</Button>
            <Button type="submit" className="flex-1 bg-gradient-primary shadow-glow">Create Trip</Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
