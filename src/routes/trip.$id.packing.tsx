import { createFileRoute, useParams } from '@tanstack/react-router';
import { useState } from 'react';
import { useTrips } from '@/lib/trip-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Shirt, Plug, FileText, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export const Route = createFileRoute('/trip/$id/packing')({ component: PackingPage });

const CATEGORIES = ['Clothing', 'Electronics', 'Documents', 'Toiletries', 'Other'];
const ICONS: Record<string, any> = { Clothing: Shirt, Electronics: Plug, Documents: FileText, Toiletries: Sparkles, Other: Sparkles };

function PackingPage() {
  const { id } = useParams({ from: '/trip/$id/packing' });
  const { getTrip, addPack, removePack, togglePack } = useTrips();
  const trip = getTrip(id);
  const [name, setName] = useState('');
  const [cat, setCat] = useState('Clothing');
  if (!trip) return null;

  const total = trip.packing.length;
  const packed = trip.packing.filter((i) => i.is_packed).length;
  const pct = total ? Math.round((packed / total) * 100) : 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addPack(trip.id, { item_name: name.trim(), category: cat, is_packed: false });
    setName('');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card p-5 shadow-card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold">Packing Progress</h3>
          <span className="text-sm font-semibold text-primary">{packed}/{total} packed</span>
        </div>
        <Progress value={pct} className="h-2" />
      </div>

      <form onSubmit={submit} className="rounded-2xl border bg-card p-4 shadow-card flex flex-wrap gap-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Add an item…" className="flex-1 min-w-[160px]" />
        <Select value={cat} onValueChange={setCat}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
        </Select>
        <Button type="submit" className="bg-gradient-primary"><Plus className="w-4 h-4" /> Add</Button>
      </form>

      <div className="grid sm:grid-cols-2 gap-4">
        {CATEGORIES.map((c) => {
          const items = trip.packing.filter((i) => i.category === c);
          if (!items.length) return null;
          const Icon = ICONS[c];
          return (
            <div key={c} className="rounded-2xl border bg-card p-5 shadow-card">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-ocean text-primary-foreground grid place-items-center"><Icon className="w-4 h-4" /></div>
                <h4 className="font-bold">{c}</h4>
                <span className="ml-auto text-xs text-muted-foreground">{items.filter((i) => i.is_packed).length}/{items.length}</span>
              </div>
              <ul className="space-y-1.5">
                {items.map((i) => (
                  <li key={i.id} className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-secondary/50 group">
                    <Checkbox checked={i.is_packed} onCheckedChange={() => togglePack(trip.id, i.id)} />
                    <span className={`flex-1 text-sm ${i.is_packed ? 'line-through text-muted-foreground' : ''}`}>{i.item_name}</span>
                    <button onClick={() => removePack(trip.id, i.id)} className="opacity-0 group-hover:opacity-100 text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
