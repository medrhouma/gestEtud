'use client';
import { useState } from 'react';

const classes = ['DSI', 'MDW', 'RSI', 'IT', 'GM', 'GC', 'EL'];
const departements = ['INFORMATIQUE', 'MECANIQUE', 'CIVILE', 'ELECTRIQUE'];

const ProfileForm = () => {
  const [form, setForm] = useState({ nom: '', age: '', classe: '', departement: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Données soumises:', form);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h2 className="text-2xl font-bold text-blue-600">Profil Étudiant</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-md w-80 mt-4 space-y-3">
        <input
          name="nom"
          type="text"
          value={form.nom}
          onChange={handleChange}
          placeholder="Nom"
          className="w-full p-2 border rounded"
        />
        <input
          name="age"
          type="number"
          value={form.age}
          onChange={handleChange}
          placeholder="Âge"
          className="w-full p-2 border rounded"
        />
        <select name="classe" value={form.classe} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Sélectionnez votre classe</option>
          {classes.map((classe) => (
            <option key={classe} value={classe}>{classe}</option>
          ))}
        </select>
        <select name="departement" value={form.departement} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Sélectionnez votre département</option>
          {departements.map((departement) => (
            <option key={departement} value={departement}>{departement}</option>
          ))}
        </select>
        <button type="submit" className="w-full bg-blue-500 p-2 rounded text-white hover:bg-blue-700">
          Enregistrer
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;