'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState('admin');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, password: pass }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Credenciales inválidas');
        return;
      }
      router.push('/workshop/lobby');
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy p-4">
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-orange font-title font-extrabold text-3xl">SMART</span>
            <span className="text-white font-title font-extrabold text-3xl">CENTRUM</span>
          </div>
          <h1 className="text-white font-title text-xl font-semibold">People Intelligence System</h1>
          <p className="text-white/60 text-sm mt-1">Workshop Live — Panel de Facilitador</p>
        </div>

        {/* Login card */}
        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="font-title font-bold text-navy text-lg mb-6">Iniciar sesión</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Usuario</label>
              <input
                type="text"
                value={user}
                onChange={e => setUser(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-navy focus:ring-2 focus:ring-navy/20 outline-none transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Contraseña</label>
              <input
                type="password"
                value={pass}
                onChange={e => setPass(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-navy focus:ring-2 focus:ring-navy/20 outline-none transition"
                required
              />
            </div>
          </div>

          {error && (
            <p className="mt-3 text-sm text-centrum-red bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full py-3 bg-navy text-white font-semibold rounded-xl hover:bg-navy/90 transition disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="text-center text-white/40 text-xs mt-6">
          CENTRUM PUCP × Smart Centrum — Workshop de Cocreación
        </p>
      </div>
    </div>
  );
}
