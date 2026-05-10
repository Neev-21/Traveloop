import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { useTrips } from '@/lib/trip-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Heart, X } from 'lucide-react';
import { POPULAR_CITIES } from '@/lib/mock-data';
import { toast } from 'sonner';

export const Route = createFileRoute('/profile')({ component: Profile });

function Profile() {
  const { user, setUser } = useTrips();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [language, setLanguage] = useState(user.language);

  const save = (e: React.FormEvent) => { e.preventDefault(); setUser({ name, email, language }); toast.success('Profile updated'); };
  const toggleSaved = (city: string) => {
    setUser({ saved: user.saved.includes(city) ? user.saved.filter((c) => c !== city) : [...user.saved, city] });
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <div className="rounded-3xl bg-gradient-ocean text-primary-foreground p-6 sm:p-8 shadow-glow flex items-center gap-5 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30 bg-mesh" />
          <Avatar className="w-20 h-20 ring-4 ring-white/30 relative"><AvatarImage src={user.avatar} /><AvatarFallback>{user.name[0]}</AvatarFallback></Avatar>
          <div className="relative">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="opacity-90 text-sm">{user.email}</p>
          </div>
        </div>

        <form onSubmit={save} className="mt-6 glass-strong rounded-3xl p-6 shadow-soft space-y-4">
          <h2 className="font-bold">Account Settings</h2>
          <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" /></div>
          <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" /></div>
          <div>
            <Label>Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['English', 'Hindi', 'Spanish', 'French', 'Japanese'].map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="bg-gradient-primary shadow-glow">Save Changes</Button>
        </form>

        <div className="mt-6 glass-strong rounded-3xl p-6 shadow-soft">
          <h2 className="font-bold flex items-center gap-2"><Heart className="w-4 h-4 text-accent" /> Saved Destinations</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {user.saved.map((c) => (
              <Badge key={c} className="bg-gradient-sunset text-primary-foreground py-1.5 pl-3 pr-1 gap-1">{c}
                <button onClick={() => toggleSaved(c)} className="ml-1 hover:bg-white/20 rounded p-0.5"><X className="w-3 h-3" /></button>
              </Badge>
            ))}
            {user.saved.length === 0 && <p className="text-sm text-muted-foreground">No saved destinations yet.</p>}
          </div>
          <div className="mt-5">
            <p className="text-xs text-muted-foreground mb-2">Add from popular destinations</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_CITIES.filter((c) => !user.saved.includes(c.name)).slice(0, 8).map((c) => (
                <button key={c.name} onClick={() => toggleSaved(c.name)} className="text-xs px-3 py-1.5 rounded-full border hover:bg-secondary">+ {c.name}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
