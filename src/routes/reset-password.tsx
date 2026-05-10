import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Compass, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const Route = createFileRoute('/reset-password')({ component: ResetPasswordPage });

function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast.error('Password must be at least 6 characters');
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success('Password updated');
    navigate({ to: '/' });
  };

  return (
    <div className="min-h-screen grid place-items-center bg-mesh p-6">
      <form onSubmit={submit} className="w-full max-w-md glass-strong rounded-3xl p-8 shadow-soft">
        <div className="flex items-center gap-2 mb-6">
          <img src="/favicon.png" alt="Traveloop" className="w-10 h-10 rounded-xl object-contain" />
          <span className="text-2xl font-bold">Traveloop</span>
        </div>
        <h1 className="text-2xl font-bold">Set a new password</h1>
        <p className="text-sm text-muted-foreground mt-1">Enter your new password below.</p>
        <div className="mt-6">
          <Label htmlFor="password">New password</Label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9" placeholder="••••••••" />
          </div>
        </div>
        <Button type="submit" disabled={busy} className="w-full mt-6 bg-gradient-primary shadow-glow">
          {busy ? 'Updating…' : 'Update password'}
        </Button>
      </form>
    </div>
  );
}
