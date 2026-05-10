import { ReactNode, useEffect } from 'react';
import { Link, Outlet, useRouterState, useNavigate } from '@tanstack/react-router';
import { Compass, LayoutDashboard, Map, User, LogOut, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useTrips } from '@/lib/trip-context';
import { cn } from '@/lib/utils';

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/trips', label: 'My Trips', icon: Map },
  { to: '/profile', label: 'Profile', icon: User },
];

export function AppLayout({ children }: { children?: ReactNode }) {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { user, logout, isAuthed, loading } = useTrips();
  const navigate = useNavigate();
  const isActive = (to: string) => (to === '/' ? path === '/' : path.startsWith(to));

  useEffect(() => {
    if (!loading && !isAuthed) navigate({ to: '/auth' });
  }, [loading, isAuthed, navigate]);

  if (loading || !isAuthed) {
    return (
      <div className="min-h-screen grid place-items-center bg-mesh">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-mesh">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex w-64 flex-col glass-strong border-r p-4 sticky top-0 h-screen">
        <Link to="/" className="flex items-center gap-2 px-2 py-3 mb-4">
          <img src="/favicon.png" alt="Traveloop" className="w-9 h-9 rounded-xl object-contain shadow-glow" />
          <span className="text-xl font-bold tracking-tight">Traveloop</span>
        </Link>
        <nav className="flex-1 flex flex-col gap-1">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive(n.to) ? 'bg-gradient-primary text-primary-foreground shadow-glow' : 'hover:bg-secondary text-foreground/80',
              )}
            >
              <n.icon className="w-4 h-4" />
              {n.label}
            </Link>
          ))}
          <Button onClick={() => navigate({ to: '/create' })} className="mt-3 bg-gradient-sunset hover:opacity-90 shadow-soft">
            <Plus className="w-4 h-4" /> Plan New Trip
          </Button>
        </nav>
        <div className="mt-4 p-3 rounded-xl glass flex items-center gap-3">
          <Avatar className="w-9 h-9"><AvatarImage src={user.avatar} /><AvatarFallback>A</AvatarFallback></Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">{user.name}</div>
            <div className="text-xs text-muted-foreground truncate">{user.email}</div>
          </div>
          <button onClick={async () => { await logout(); navigate({ to: '/auth' }); }} className="text-muted-foreground hover:text-destructive">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between p-4 glass-strong sticky top-0 z-30">
          <Link to="/" className="flex items-center gap-2">
            <img src="/favicon.png" alt="Traveloop" className="w-8 h-8 rounded-lg object-contain" />
            <span className="font-bold">Traveloop</span>
          </Link>
          <Avatar className="w-8 h-8"><AvatarImage src={user.avatar} /><AvatarFallback>A</AvatarFallback></Avatar>
        </header>

        <div className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">{children ?? <Outlet />}</div>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-strong border-t z-40">
          <div className="flex items-center justify-around py-2">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className={cn('flex flex-col items-center gap-1 p-2 rounded-lg text-xs', isActive(n.to) ? 'text-primary' : 'text-muted-foreground')}>
                <n.icon className="w-5 h-5" />
                {n.label}
              </Link>
            ))}
            <Link to="/create" className="flex flex-col items-center gap-1 p-2 text-xs">
              <div className="w-9 h-9 -mt-5 rounded-full bg-gradient-sunset grid place-items-center shadow-glow"><Plus className="w-5 h-5 text-primary-foreground" /></div>
              <span className="text-muted-foreground">New</span>
            </Link>
          </div>
        </nav>
      </main>
    </div>
  );
}
