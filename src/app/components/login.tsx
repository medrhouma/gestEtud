'use client';
import React, { useState } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const LoginForm = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    // Validation des champs requis
    if (!form.email || !form.password) {
      setMessage('Tous les champs sont requis.');
      setLoading(false);
      return;
    }

    // Validation du mot de passe (exemple basique, tu peux ajuster la logique)
    if (form.password.length < 6) {
      setMessage('Le mot de passe doit contenir au moins 6 caractères.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === 'string'
            ? data.detail
            : JSON.stringify(data.detail || `Erreur HTTP ${response.status}`)
        );
      }

      setMessage('Connexion réussie ! Redirection...');
      setTimeout(() => {
        window.location.href = '/profile'; // Redirection après la connexion
      }, 2000);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setLoading(true);
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 ${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-8">Connexion</h1>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">Connectez-vous</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-gray-600 text-sm" htmlFor="email">Email</label>
                <input
                  name="email"
                  type="email"
                  id="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                  aria-label="Email"
                />
              </div>
              <div>
                <label className="text-gray-600 text-sm" htmlFor="password">Mot de passe</label>
                <input
                  name="password"
                  type="password"
                  id="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Mot de passe"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                  aria-label="Mot de passe"
                />
              </div>
              {message && (
                <p className={`text-sm ${message.includes('réussie') ? 'text-green-500' : 'text-red-500'}`}>
                  {message}
                </p>
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                disabled={loading}
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
