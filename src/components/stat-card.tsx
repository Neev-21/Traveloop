import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function StatCard({
  label, value, icon, trend, gradient = 'primary',
}: { label: string; value: ReactNode; icon: ReactNode; trend?: string; gradient?: 'primary' | 'sunset' | 'ocean' | 'forest' }) {
  return (
    <div className="rounded-2xl p-5 glass shadow-card hover-lift relative overflow-hidden">
      <div className={cn('absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-20 blur-2xl', `bg-gradient-${gradient}`)} />
      <div className="flex items-start justify-between relative">
        <div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
          <div className="text-2xl font-bold mt-1">{value}</div>
          {trend && <div className="text-xs text-success mt-1">{trend}</div>}
        </div>
        <div className={cn('w-10 h-10 rounded-xl grid place-items-center text-primary-foreground', `bg-gradient-${gradient}`)}>{icon}</div>
      </div>
    </div>
  );
}
