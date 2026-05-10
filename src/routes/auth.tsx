import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Compass, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTrips } from '@/lib/trip-context';
import { toast } from 'sonner';

export const Route = createFileRoute('/auth')({ component: AuthPage });

function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const { login, signup, loginWithGoogle, forgotPassword, isAuthed } = useTrips();
  const navigate = useNavigate();

  useEffect(() => { if (isAuthed) navigate({ to: '/' }); }, [isAuthed, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return toast.error('Enter a valid email');
    if (mode !== 'forgot' && password.length < 6) return toast.error('Password must be at least 6 characters');
    setBusy(true);
    try {
      if (mode === 'forgot') {
        const { error } = await forgotPassword(email);
        if (error) return toast.error(error);
        toast.success('Reset link sent — check your inbox');
        setMode('login');
        return;
      }
      const { error } = mode === 'login' ? await login(email, password) : await signup(email, password);
      if (error) return toast.error(error);
      if (mode === 'signup') {
        toast.success('Account created — check your email to verify');
      } else {
        toast.success('Welcome back!');
        navigate({ to: '/' });
      }
    } finally { setBusy(false); }
  };

  const google = async () => {
    setBusy(true);
    const { error } = await loginWithGoogle();
    if (error) { toast.error(error); setBusy(false); }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-mesh">
      <div className="hidden lg:flex relative bg-gradient-ocean items-center justify-center p-12 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-mesh animate-gradient" />
        <div className="relative max-w-md">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur grid place-items-center"><Compass className="w-5 h-5" /></div>
            <span className="text-2xl font-bold">Traveloop</span>
          </div>
          <h2 className="text-4xl font-bold leading-tight">Your journey, beautifully planned.</h2>
          <p className="mt-4 opacity-90">Multi-city itineraries, smart budgets, packing checklists, and shareable trips — all in one place.</p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400','https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400','https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400'].map((s, i) => (
              <img key={i} src={s} className="rounded-xl aspect-square object-cover animate-float" style={{ animationDelay: `${i*0.5}s` }} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <form onSubmit={submit} className="w-full max-w-md glass-strong rounded-3xl p-8 shadow-soft">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary grid place-items-center"><Compass className="w-5 h-5 text-primary-foreground" /></div>
            <span className="text-2xl font-bold">Traveloop</span>
          </div>
          <h1 className="text-2xl font-bold">
            {mode === 'login' && 'Welcome back'}
            {mode === 'signup' && 'Create your account'}
            {mode === 'forgot' && 'Reset password'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === 'login' && 'Sign in to continue planning.'}
            {mode === 'signup' && 'Start your journey in seconds.'}
            {mode === 'forgot' && "We'll email you a reset link."}
          </p>

          <Button type="button" onClick={google} disabled={busy} variant="outline" className="w-full mt-5">
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </Button>
          <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px bg-border flex-1" /> or <div className="h-px bg-border flex-1" />
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" placeholder="you@example.com" />
              </div>
            </div>
            {mode !== 'forgot' && (
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9" placeholder="••••••••" />
                </div>
              </div>
            )}
          </div>

          <Button type="submit" disabled={busy} className="w-full mt-6 bg-gradient-primary shadow-glow">
            {mode === 'login' && (busy ? 'Signing in…' : 'Sign in')}
            {mode === 'signup' && (busy ? 'Creating…' : 'Create account')}
            {mode === 'forgot' && (busy ? 'Sending…' : 'Send reset link')}
          </Button>

          <div className="mt-4 text-sm text-center text-muted-foreground space-y-1">
            {mode === 'login' && (
              <>
                <button type="button" onClick={() => setMode('forgot')} className="text-primary hover:underline">Forgot password?</button>
                <div>New here? <button type="button" onClick={() => setMode('signup')} className="text-primary font-medium">Sign up</button></div>
              </>
            )}
            {mode === 'signup' && <div>Already have an account? <button type="button" onClick={() => setMode('login')} className="text-primary font-medium">Sign in</button></div>}
            {mode === 'forgot' && <button type="button" onClick={() => setMode('login')} className="text-primary">Back to sign in</button>}
          </div>
          <div className="mt-4 text-center"><Link to="/" className="text-xs text-muted-foreground hover:underline">Back to home →</Link></div>
        </form>
      </div>
    </div>
  );
}
