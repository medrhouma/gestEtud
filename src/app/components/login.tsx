'use client';
import { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage('Tous les champs sont requis.');
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Échec de connexion');

      localStorage.setItem('token', data.token);
      setMessage('Connexion réussie ! Redirection...');
      setTimeout(() => (window.location.href = '/stream'), 2000);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Une erreur est survenue.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h2 className="text-3xl font-bold text-blue-500">Connexion</h2>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-md w-80 mt-4">
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email ou nom d'utilisateur"
          className="w-full p-2 mb-3 bg-gray-700 rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          className="w-full p-2 mb-3 bg-gray-700 rounded"
        />
        {message && <p className="text-red-400">{message}</p>}
        <button type="submit" className="w-full bg-blue-500 p-2 rounded hover:bg-blue-700">
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default Login;