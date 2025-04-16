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

// Liste étendue des formations et des cours indépendants
const formations = [
  'Développement Web',
  'Analyse de Données',
  'Sécurité Informatique',
  'Intelligence Artificielle',
  'DevOps & Cloud Computing',
  'Design UX/UI',
  'Développement Mobile',
  'Blockchain & Cryptomonnaies',
  'Marketing Digital',
];

const coursDisponibles = [
  // Développement Web
  'HTML & CSS', 'JavaScript', 'React.js', 'Node.js', 'Vue.js', 'PHP & MySQL',
  // Analyse de Données
  'Python', 'Machine Learning', 'Data Visualization', 'SQL & NoSQL', 'R Programming',
  // Sécurité Informatique
  'Cryptographie', 'Pentesting', 'Sécurité Réseau', 'Forensics', 'Analyse de Vulnérabilités',
  // Intelligence Artificielle
  'Deep Learning', 'Computer Vision', 'NLP', 'Algorithmes Génétiques', 'Systèmes Experts',
  // DevOps & Cloud Computing
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'CI/CD', 'Terraform',
  // Design UX/UI
  'Figma', 'Adobe XD', 'Principes UX', 'Design Systems', 'Prototypage',
  // Développement Mobile
  'React Native', 'Flutter', 'Swift', 'Kotlin', 'Progressive Web Apps',
  // Blockchain
  'Ethereum', 'Smart Contracts', 'Web3.js', 'DeFi', 'NFTs',
  // Marketing Digital
  'SEO', 'Content Marketing', 'Analytics', 'Social Media', 'Email Marketing',
];

// Correspondance entre formations et cours
const coursParFormation = {
  'Développement Web': ['HTML & CSS', 'JavaScript', 'React.js', 'Node.js', 'Vue.js', 'PHP & MySQL'],
  'Analyse de Données': ['Python', 'Machine Learning', 'Data Visualization', 'SQL & NoSQL', 'R Programming'],
  'Sécurité Informatique': ['Cryptographie', 'Pentesting', 'Sécurité Réseau', 'Forensics', 'Analyse de Vulnérabilités'],
  'Intelligence Artificielle': ['Deep Learning', 'Computer Vision', 'NLP', 'Algorithmes Génétiques', 'Systèmes Experts'],
  'DevOps & Cloud Computing': ['Docker', 'Kubernetes', 'AWS', 'Azure', 'CI/CD', 'Terraform'],
  'Design UX/UI': ['Figma', 'Adobe XD', 'Principes UX', 'Design Systems', 'Prototypage'],
  'Développement Mobile': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Progressive Web Apps'],
  'Blockchain & Cryptomonnaies': ['Ethereum', 'Smart Contracts', 'Web3.js', 'DeFi', 'NFTs'],
  'Marketing Digital': ['SEO', 'Content Marketing', 'Analytics', 'Social Media', 'Email Marketing'],
};

export default function CoursesPage() {
  const [user, setUser] = useState<{
    formationChoisie: string;
    coursInscrits: string[];
  }>({
    formationChoisie: '',
    coursInscrits: [],
  });
  const [coursFiltrés, setCoursFiltrés] = useState<string[]>([]);
  const [afficherTousCours, setAfficherTousCours] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser.formationChoisie || storedUser.coursInscrits) {
      setUser({
        formationChoisie: storedUser.formationChoisie || '',
        coursInscrits: storedUser.coursInscrits || [],
      });
    }
  }, []);

  useEffect(() => {
    if (user.formationChoisie && !afficherTousCours) {
      setCoursFiltrés(coursParFormation[user.formationChoisie as keyof typeof coursParFormation] || []);
    } else {
      setCoursFiltrés(coursDisponibles);
    }
  }, [user.formationChoisie, afficherTousCours]);

  const inscrireFormation = (formation: string) => {
    if (user.formationChoisie !== formation) {
      const updatedUser = { ...user, formationChoisie: formation };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const inscrireCours = (cours: string) => {
    if (!user.coursInscrits.includes(cours)) {
      const updatedUser = { ...user, coursInscrits: [...user.coursInscrits, cours] };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const desinscriptionCours = (cours: string) => {
    const updatedCourses = user.coursInscrits.filter((c) => c !== cours);
    const updatedUser = { ...user, coursInscrits: updatedCourses };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 ${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-8">Cours et Formations</h1>

        {/* Affichage des cours inscrits */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-blue-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">Cours Inscrits</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 text-sm">Cours actuellement inscrits</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sélection de la formation */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-green-600 px-6 py-3">
              <h3 className="text-xl font-semibold text-white">Choisir une Formation</h3>
            </div>
            <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
              {formations.map((formation) => (
                <button
                  key={formation}
                  onClick={() => inscrireFormation(formation)}
                  className={`flex items-center justify-between w-full py-3 px-4 rounded-md transition-colors ${
                    user.formationChoisie === formation
                      ? 'bg-green-100 text-green-800 border border-green-500'
                      : 'bg-white border hover:bg-green-50 text-gray-800'
                  }`}
                >
                  <span>{formation}</span>
                  {user.formationChoisie === formation && (
                    <span className="text-green-600">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Sélection des cours */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-600 px-6 py-3">
              <h3 className="text-xl font-semibold text-white">S'inscrire aux Cours</h3>
            </div>
            <div className="px-6 pt-4">
              <div className="flex items-center mb-4">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!afficherTousCours}
                    onChange={() => setAfficherTousCours(!afficherTousCours)}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-700">
                    {afficherTousCours ? 'Afficher tous les cours' : 'Filtrer par formation sélectionnée'}
                  </span>
                </label>
              </div>
            </div>
            <div className="px-6 pb-6">
              <input
                type="text"
                placeholder="Rechercher un cours..."
                className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {
                  const searchValue = e.target.value.toLowerCase();
                  if (searchValue) {
                    const baseList = afficherTousCours
                      ? coursDisponibles
                      : user.formationChoisie
                      ? coursParFormation[user.formationChoisie as keyof typeof coursParFormation]
                      : [];
                    setCoursFiltrés(baseList.filter((cours) => cours.toLowerCase().includes(searchValue)));
                  } else {
                    setCoursFiltrés(
                      afficherTousCours
                        ? coursDisponibles
                        : user.formationChoisie
                        ? coursParFormation[user.formationChoisie as keyof typeof coursParFormation]
                        : []
                    );
                  }
                }}
              />
            </div>
            <div className="px-6 pb-6 grid grid-cols-1 gap-3 max-h-72 overflow-y-auto">
              {coursFiltrés.length > 0 ? (
                coursFiltrés.map((cours) => (
                  <button
                    key={cours}
                    onClick={() => inscrireCours(cours)}
                    disabled={user.coursInscrits.includes(cours)}
                    className={`flex items-center justify-between w-full py-2 px-4 rounded-md transition-colors ${
                      user.coursInscrits.includes(cours)
                        ? 'bg-blue-100 text-blue-800 border border-blue-500 cursor-not-allowed'
                        : 'bg-white border hover:bg-blue-50 text-gray-800'
                    }`}
                  >
                    <span>{cours}</span>
                    {user.coursInscrits.includes(cours) && (
                      <span className="text-blue-600">✓</span>
                    )}
                  </button>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">Aucun cours trouvé</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}