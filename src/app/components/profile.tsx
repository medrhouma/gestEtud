'use client';
import React, { useEffect, useState } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';

// Définir les polices comme dans le layout
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function ProfilePage() {
  const [user, setUser] = useState<{
    nom: string;
    age: string;
    classe: string;
    departement: string;
    formationChoisie: string;
    coursInscrits: string[];
  }>({
    nom: '',
    age: '',
    classe: '',
    departement: '',
    formationChoisie: '',
    coursInscrits: [],
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Charger les informations de l'utilisateur depuis localStorage
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

    if (storedUser) {
      setUser({
        nom: storedUser.nom || '',
        age: storedUser.age || '',
        classe: storedUser.classe || '',
        departement: storedUser.departement || '',
        formationChoisie: storedUser.formationChoisie || '',
        coursInscrits: storedUser.coursInscrits || [],
      });
    }
  }, []);  // Cela se lance au premier rendu, après le montage du composant

  // Désinscription d'un cours
  const desinscriptionCours = async (cours: string) => {
    try {
      const updatedCourses = user.coursInscrits.filter((c) => c !== cours);
      const updatedUser = { ...user, coursInscrits: updatedCourses };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Appeler l'API pour mettre à jour les cours inscrits sur le serveur
      const response = await fetch('/api/update-courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ coursInscrits: updatedCourses }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour des cours');
      }
    } catch (error) {
      setError('Une erreur est survenue lors de la désinscription.');
      console.error('Erreur lors de la désinscription du cours:', error);
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 ${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-8">Profil Étudiant</h1>

        {/* Carte de profil */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">Profil Étudiant</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Nom</p>
                <p className="font-medium">{user.nom || 'Non défini'}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Âge</p>
                <p className="font-medium">{user.age || 'Non défini'}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Classe</p>
                <p className="font-medium">{user.classe || 'Non défini'}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Département</p>
                <p className="font-medium">{user.departement || 'Non défini'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-600 text-sm">Formation choisie</p>
                <p className="font-medium">{user.formationChoisie || 'Aucune sélectionnée'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-600 text-sm">Cours inscrits</p>
                {user.coursInscrits.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.coursInscrits.map((cours) => (
                      <span
                        key={cours}
                        className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded flex items-center"
                      >
                        {cours}
                        <button
                          onClick={() => desinscriptionCours(cours)}
                          className="ml-1 text-blue-800 hover:text-red-700"
                          aria-label={`Désinscrire du cours ${cours}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="font-medium">Aucun cours sélectionné</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Affichage des erreurs */}
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </div>
    </div>
  );
}
