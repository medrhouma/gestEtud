'use client';

import { useEffect, useState } from 'react';

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

const coursDisponibleParFormation: { [key: string]: string[] } = {
  'Développement Web': [
    'HTML & CSS',
    'JavaScript',
    'React.js',
    'Node.js',
    'Vue.js',
    'PHP & MySQL',
  ],
  'Analyse de Données': [
    'Python',
    'Machine Learning',
    'Data Visualization',
    'SQL & NoSQL',
    'R Programming',
  ],
  'Sécurité Informatique': [
    'Cryptographie',
    'Pentesting',
    'Sécurité Réseau',
    'Forensics',
    'Analyse de Vulnérabilités',
  ],
  'Intelligence Artificielle': [
    'Deep Learning',
    'Computer Vision',
    'NLP',
    'Algorithmes Génétiques',
    'Systèmes Experts',
  ],
  'DevOps & Cloud Computing': [
    'Docker',
    'Kubernetes',
    'AWS',
    'Azure',
    'CI/CD',
    'Terraform',
  ],
  'Design UX/UI': [
    'Figma',
    'Adobe XD',
    'Principes UX',
    'Design Systems',
    'Prototypage',
  ],
  'Développement Mobile': [
    'React Native',
    'Flutter',
    'Swift',
    'Kotlin',
    'Progressive Web Apps',
  ],
  'Blockchain & Cryptomonnaies': [
    'Ethereum',
    'Smart Contracts',
    'Web3.js',
    'DeFi',
    'NFTs',
  ],
  'Marketing Digital': [
    'SEO',
    'Content Marketing',
    'Analytics',
    'Social Media',
    'Email Marketing',
  ],
};

export default function PageCours() {
  const [user, setUser] = useState({
    formationChoisie: '',
    coursInscrits: [] as string[],
  });

  const [favoris, setFavoris] = useState<string[]>([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser.formationChoisie || storedUser.coursInscrits) {
      setUser({
        formationChoisie: storedUser.formationChoisie || '',
        coursInscrits: storedUser.coursInscrits || [],
      });
    }
    const storedFavoris = JSON.parse(localStorage.getItem('favoris') || '[]');
    setFavoris(storedFavoris);
  }, []);

  const handleFormationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const formationChoisie = event.target.value;
    setUser({
      formationChoisie,
      coursInscrits: [],
    });
    localStorage.setItem(
      'user',
      JSON.stringify({ formationChoisie, coursInscrits: [] })
    );
  };

  const toggleInscriptionCours = (cours: string) => {
    let updatedCours;
    if (user.coursInscrits.includes(cours)) {
      updatedCours = user.coursInscrits.filter((c) => c !== cours);
    } else {
      updatedCours = [...user.coursInscrits, cours];
    }
    setUser((prevUser) => ({
      ...prevUser,
      coursInscrits: updatedCours,
    }));
    localStorage.setItem(
      'user',
      JSON.stringify({ ...user, coursInscrits: updatedCours })
    );
  };

  const toggleFavori = (cours: string) => {
    let updatedFavoris;
    if (favoris.includes(cours)) {
      updatedFavoris = favoris.filter((f) => f !== cours);
    } else {
      updatedFavoris = [...favoris, cours];
    }
    setFavoris(updatedFavoris);
    localStorage.setItem('favoris', JSON.stringify(updatedFavoris));
  };

  const coursFiltrés = coursDisponibleParFormation[user.formationChoisie] || [];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Page Cours</h1>

      {/* Sélecteur de formation */}
      <div className="mb-6">
        <label htmlFor="formation" className="block mb-2 font-semibold">
          Choisissez une formation :
        </label>
        <select
          id="formation"
          value={user.formationChoisie}
          onChange={handleFormationChange}
          className="border rounded p-2 w-full max-w-xs"
        >
          <option value="">-- Sélectionnez --</option>
          {formations.map((formation) => (
            <option key={formation} value={formation}>
              {formation}
            </option>
          ))}
        </select>
      </div>

      {/* Liste des cours disponibles */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Cours disponibles</h2>
        {coursFiltrés.length > 0 ? (
          <ul className="space-y-2">
            {coursFiltrés.map((cours) => (
              <li
                key={cours}
                className="flex items-center justify-between border p-3 rounded"
              >
                <span>{cours}</span>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => toggleInscriptionCours(cours)}
                    className={`px-3 py-1 rounded text-white ${
                      user.coursInscrits.includes(cours)
                        ? 'bg-green-600 hover:bg-green-800'
                        : 'bg-blue-600 hover:bg-blue-800'
                    }`}
                  >
                    {user.coursInscrits.includes(cours) ? 'Désinscrire' : 'S\'inscrire'}
                  </button>

                  <button
                    onClick={() => toggleFavori(cours)}
                    aria-label={
                      favoris.includes(cours)
                        ? 'Retirer des favoris'
                        : 'Ajouter aux favoris'
                    }
                    className={`text-2xl ${
                      favoris.includes(cours)
                        ? 'text-yellow-400'
                        : 'text-gray-400 hover:text-yellow-400'
                    }`}
                    title={
                      favoris.includes(cours)
                        ? 'Retirer des favoris'
                        : 'Ajouter aux favoris'
                    }
                  >
                    ★
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun cours disponible pour cette formation.</p>
        )}
      </div>

      {/* Affichage des favoris */}
      <div className="bg-yellow-100 p-4 rounded">
        <h2 className="text-2xl font-semibold mb-4">Cours Favoris</h2>
        {favoris.length > 0 ? (
          <ul>
            {favoris.map((fav) => (
              <li
                key={fav}
                className="flex justify-between items-center border p-2 mb-2 rounded"
              >
                <span>{fav}</span>
                <button
                  onClick={() => toggleFavori(fav)}
                  className="text-red-600 hover:text-red-900"
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun cours en favoris</p>
        )}
      </div>
    </div>
  );
}
