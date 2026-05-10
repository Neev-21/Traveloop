import { createFileRoute, useParams } from '@tanstack/react-router';
import { useState } from 'react';
import { useTrips } from '@/lib/trip-context';
import { StatCard } from '@/components/stat-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wallet, TrendingUp, Calendar, AlertTriangle } from 'lucide-react';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Expense } from '@/lib/mock-data';
import { toast } from 'sonner';

export const Route = createFileRoute('/trip/$id/budget')({ component: BudgetPage });

const COLORS = ['oklch(0.62 0.18 220)', 'oklch(0.72 0.18 35)', 'oklch(0.65 0.15 155)', 'oklch(0.78 0.16 75)'];
const CATS: Expense['category'][] = ['transport', 'stay', 'meals', 'activities'];
const LABELS: Record<Expense['category'], string> = { transport: 'Transport', stay: 'Stay', meals: 'Meals', activities: 'Activities' };

function BudgetPage() {
  const { id } = useParams({ from: '/trip/$id/budget' });
  const { getTrip, setExpense } = useTrips();
  const trip = getTrip(id);
  const [budget, setBudget] = useState<number>(80000);
  if (!trip) return null;

  const total = trip.expenses.reduce((s, e) => s + e.amount, 0);
  const days = Math.max(differenceInCalendarDays(parseISO(trip.end_date), parseISO(trip.start_date)) + 1, 1);
  const perDay = Math.round(total / days);
  const data = CATS.map((c) => ({ name: LABELS[c], value: trip.expenses.find((e) => e.category === c)?.amount ?? 0, key: c }));
  const overBudget = total > budget;

  const updateAmount = (cat: Expense['category'], v: number) => {
    const existing = trip.expenses.find((e) => e.category === cat);
    setExpense(trip.id, { id: existing?.id ?? cat, category: cat, amount: v, label: existing?.label ?? LABELS[cat] });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total Spend" value={`₹${total.toLocaleString()}`} icon={<Wallet className="w-5 h-5" />} gradient="primary" />
        <StatCard label="Per Day" value={`₹${perDay.toLocaleString()}`} icon={<Calendar className="w-5 h-5" />} gradient="ocean" />
        <StatCard label="Days" value={days} icon={<TrendingUp className="w-5 h-5" />} gradient="forest" />
        <StatCard label={overBudget ? 'Over Budget' : 'Under Budget'} value={`₹${Math.abs(budget - total).toLocaleString()}`} icon={<AlertTriangle className="w-5 h-5" />} gradient={overBudget ? 'sunset' : 'forest'} />
      </div>

      {overBudget && (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <div className="text-sm"><b>Over budget!</b> You're ₹{(total - budget).toLocaleString()} above your target.</div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border bg-card p-5 shadow-card">
          <h3 className="font-bold mb-4">Breakdown by Category</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3}>
                  {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-5 shadow-card">
          <h3 className="font-bold mb-4">Compare Categories</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={data}>
                <XAxis dataKey="name" stroke="oklch(0.5 0.03 250)" fontSize={12} />
                <YAxis stroke="oklch(0.5 0.03 250)" fontSize={12} />
                <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-5 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="font-bold">Edit Budget</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Target:</span>
            <Input type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-32" />
            <Button size="sm" onClick={() => toast.success('Budget updated')}>Save</Button>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CATS.map((c, i) => (
            <div key={c} className="rounded-xl border p-3">
              <div className="text-xs uppercase tracking-wider text-muted-foreground" style={{ color: COLORS[i] }}>{LABELS[c]}</div>
              <Input type="number" defaultValue={trip.expenses.find((e) => e.category === c)?.amount ?? 0} onBlur={(e) => updateAmount(c, Number(e.target.value))} className="mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
