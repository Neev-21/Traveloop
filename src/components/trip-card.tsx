import { Link } from '@tanstack/react-router';
import { Calendar, MapPin, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import { Trip } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

export function TripCard({ trip, onDelete }: { trip: Trip; onDelete?: (id: string) => void }) {
  return (
    <div className="group relative rounded-2xl overflow-hidden shadow-card hover-lift bg-card">
      <div className="relative h-44 overflow-hidden">
        <img src={trip.cover_photo} alt={trip.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="secondary" className="w-8 h-8 rounded-full glass"><MoreVertical className="w-4 h-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild><Link to="/trip/$id/view" params={{ id: trip.id }}><Eye className="w-4 h-4 mr-2" />View</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/trip/$id/build" params={{ id: trip.id }}><Edit className="w-4 h-4 mr-2" />Edit</Link></DropdownMenuItem>
              {onDelete && <DropdownMenuItem onClick={() => onDelete(trip.id)} className="text-destructive"><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="text-xs opacity-90 flex items-center gap-1"><MapPin className="w-3 h-3" /> {trip.stops.length} stops</div>
          <h3 className="text-lg font-bold leading-tight mt-0.5">{trip.name}</h3>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          {format(new Date(trip.start_date), 'MMM d')} – {format(new Date(trip.end_date), 'MMM d, yyyy')}
        </div>
        <p className="text-sm mt-2 line-clamp-2 text-muted-foreground">{trip.description}</p>
        <div className="mt-4 flex gap-2">
          <Link to="/trip/$id/view" params={{ id: trip.id }} className="flex-1">
            <Button variant="outline" className="w-full" size="sm">View</Button>
          </Link>
          <Link to="/trip/$id/build" params={{ id: trip.id }} className="flex-1">
            <Button className="w-full bg-gradient-primary" size="sm">Plan</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
