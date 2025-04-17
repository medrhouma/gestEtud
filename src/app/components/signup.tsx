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

const classes = ['DSI', 'MDW', 'RSI', 'IT', 'GM', 'GC', 'EL'];
const departements = ['INFORMATIQUE', 'MECANIQUE', 'CIVILE', 'ELECTRIQUE'];

const SignupForm = () => {
  const [form, setForm] = useState({
    nom: '',
    age: '',
    classe: '',
    departement: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    if (!form.nom || !form.age || !form.classe || !form.departement || !form.email || !form.password) {
      setMessage('Tous les champs sont requis.');
      setLoading(false);
      return;
    }

    console.log('Envoi des données:', form);

    try {
      const response = await fetch('http://localhost:8000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: form.nom,
          age: parseInt(form.age),
          classe: form.classe,
          departement: form.departement,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();
      console.log('Réponse API:', data);

      if (!response.ok) {
        throw new Error(
          typeof data.detail === 'string'
            ? data.detail
            : JSON.stringify(data.detail || `Erreur HTTP ${response.status}`)
        );
        
      }

      setMessage('Inscription réussie ! Redirection...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      console.error('Erreur signup:', err);
      setMessage(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 ${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-8">Inscription</h1>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">Créer votre compte</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-gray-600 text-sm" htmlFor="nom">Nom</label>
                <input
                  name="nom"
                  type="text"
                  id="nom"
                  value={form.nom}
                  onChange={handleChange}
                  placeholder="Nom"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="text-gray-600 text-sm" htmlFor="age">Âge</label>
                <input
                  name="age"
                  type="number"
                  id="age"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="Âge"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="text-gray-600 text-sm" htmlFor="classe">Classe</label>
                <select
                  name="classe"
                  id="classe"
                  value={form.classe}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  <option value="">Sélectionnez votre classe</option>
                  {classes.map((classe) => (
                    <option key={classe} value={classe}>{classe}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-gray-600 text-sm" htmlFor="departement">Département</label>
                <select
                  name="departement"
                  id="departement"
                  value={form.departement}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  <option value="">Sélectionnez votre département</option>
                  {departements.map((departement) => (
                    <option key={departement} value={departement}>{departement}</option>
                  ))}
                </select>
              </div>
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
                {loading ? 'Inscription...' : 'S\'inscrire'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;