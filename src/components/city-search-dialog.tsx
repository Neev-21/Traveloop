import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { POPULAR_CITIES } from '@/lib/mock-data';
import { Search, MapPin, TrendingUp, IndianRupee } from 'lucide-react';

export function CitySearchDialog({
  open, onOpenChange, onPick,
}: { open: boolean; onOpenChange: (b: boolean) => void; onPick: (city: { name: string; country: string }) => void }) {
  const [q, setQ] = useState('');
  const filtered = POPULAR_CITIES.filter((c) => `${c.name} ${c.country}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader><DialogTitle>Search Cities</DialogTitle></DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a city or country…" className="pl-9" />
        </div>
        <div className="overflow-y-auto -mx-2 px-2 grid sm:grid-cols-2 gap-3 mt-2">
          {filtered.map((c) => (
            <div key={c.name} className="rounded-xl overflow-hidden border bg-card hover-lift">
              <div className="h-28 relative">
                <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                <Badge className="absolute top-2 left-2 bg-black/40 backdrop-blur text-white border-0">{c.tag}</Badge>
              </div>
              <div className="p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.country}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                  <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" />Cost {c.cost_index}</span>
                  <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" />Pop {c.popularity}</span>
                </div>
                <Button size="sm" className="w-full mt-3 bg-gradient-primary" onClick={() => { onPick({ name: c.name, country: c.country }); onOpenChange(false); }}>
                  Add to Trip
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
