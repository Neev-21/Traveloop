import { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ACTIVITY_LIBRARY } from '@/lib/mock-data';
import { Search, Clock, IndianRupee } from 'lucide-react';

export function ActivitySearchDialog({
  open, onOpenChange, onPick,
}: {
  open: boolean; onOpenChange: (b: boolean) => void;
  onPick: (a: { name: string; type: string; cost: number; duration: string; time: string }) => void;
}) {
  const [q, setQ] = useState('');
  const [type, setType] = useState('all');
  const [cost, setCost] = useState('all');

  const types = useMemo(() => ['all', ...Array.from(new Set(ACTIVITY_LIBRARY.map((a) => a.type)))], []);
  const filtered = ACTIVITY_LIBRARY.filter((a) => {
    if (q && !a.name.toLowerCase().includes(q.toLowerCase())) return false;
    if (type !== 'all' && a.type !== type) return false;
    if (cost === 'free' && a.cost > 0) return false;
    if (cost === 'low' && (a.cost === 0 || a.cost > 1500)) return false;
    if (cost === 'mid' && (a.cost <= 1500 || a.cost > 4000)) return false;
    if (cost === 'high' && a.cost <= 4000) return false;
    return true;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader><DialogTitle>Find Activities</DialogTitle></DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="relative sm:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="pl-9" />
          </div>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>{types.map((t) => <SelectItem key={t} value={t}>{t === 'all' ? 'All Types' : t}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={cost} onValueChange={setCost}>
            <SelectTrigger><SelectValue placeholder="Cost" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any cost</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="low">Low (₹1-1500)</SelectItem>
              <SelectItem value="mid">Mid (₹1500-4000)</SelectItem>
              <SelectItem value="high">High (₹4000+)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-y-auto space-y-2 mt-2">
          {filtered.map((a) => (
            <div key={a.name} className="flex items-center gap-3 p-3 rounded-xl border bg-card hover:bg-secondary/50 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{a.name}</div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                  <Badge variant="secondary">{a.type}</Badge>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{a.duration}</span>
                  <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" />{a.cost === 0 ? 'Free' : a.cost}</span>
                </div>
              </div>
              <Button size="sm" className="bg-gradient-primary" onClick={() => { onPick({ ...a, time: '10:00' }); onOpenChange(false); }}>Add</Button>
            </div>
          ))}
          {filtered.length === 0 && <div className="text-center text-sm text-muted-foreground py-8">No activities match your filters.</div>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
