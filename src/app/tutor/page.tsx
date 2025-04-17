'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Geist, Geist_Mono } from 'next/font/google';

// Définir les polices
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Données d'exemple pour les tutoriels
const TUTORIALS = [
  {
    id: 1,
    title: "Apprendre les bases de HTML et CSS",
    excerpt: "Maîtrisez les fondamentaux du développement web avec ce tutoriel complet pour débutants.",
    image: "/html-css.webp",
    category: "Développement Web",
    author: "Marie Laurent",
    authorAvatar: "/avatar1.jpeg",
    date: "12 avril 2025",
    duration: "45 min",
    difficulty: "Débutant",
    featured: true
  },
  {
    id: 2,
    title: "Créer une API REST avec Node.js",
    excerpt: "Apprenez à construire une API robuste et évolutive en utilisant Express et MongoDB.",
    image: "/nodejs.jpeg",
    category: "Backend",
    author: "Thomas Dubois",
    authorAvatar: "/avatar2.jpeg",
    date: "8 avril 2025",
    duration: "60 min",
    difficulty: "Intermédiaire",
    featured: false
  },
  {
    id: 3,
    title: "Introduction à React Hooks",
    excerpt: "Découvrez comment simplifier votre code React avec les Hooks et les fonctions composants.",
    image: "/react.jpeg",
    category: "Frontend",
    author: "Sophie Martin",
    authorAvatar: "/avatar3.jpeg",
    date: "5 avril 2025",
    duration: "30 min",
    difficulty: "Intermédiaire",
    featured: false
  },
  {
    id: 4,
    title: "Créer des animations avec CSS",
    excerpt: "Apprenez à créer des animations fluides et performantes en utilisant CSS et keyframes.",
    image: "/css-animation.png",
    category: "Design",
    author: "Lucas Moreau",
    authorAvatar: "/avatar4.jpeg",
    date: "1 avril 2025",
    duration: "25 min",
    difficulty: "Débutant",
    featured: false
  }
];

// Composant pour les catégories
const Categories = ({ categories, activeCategory, setActiveCategory }: { categories: string[]; activeCategory: string; setActiveCategory: (category: string) => void }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <button
        className={`px-4 py-2 rounded-full text-sm font-medium ${
          activeCategory === "Tous" 
            ? "bg-blue-600 text-white" 
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
        onClick={() => setActiveCategory("Tous")}
      >
        Tous
      </button>
      {categories.map((category) => (
        <button
          key={category}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            activeCategory === category 
          ? "bg-blue-600 text-white" 
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setActiveCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

// Composant pour un tutoriel en vedette
const FeaturedTutorial = ({ tutorial }: { tutorial: Tutorial }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
      <div className="md:flex">
        <div className="md:w-1/2">
          <img 
            src={tutorial.image} 
            alt={tutorial.title} 
            className="w-full h-64 object-cover"
          />
        </div>
        <div className="md:w-1/2 p-6">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium mb-2">
            {tutorial.category}
          </span>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">{tutorial.title}</h2>
          <p className="text-gray-600 mb-4">{tutorial.excerpt}</p>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                <img src={tutorial.authorAvatar} alt={tutorial.author} className="w-full h-full object-cover" />
              </div>
              <p className="text-gray-700 text-sm">{tutorial.author}</p>
            </div>
            <div className="text-gray-500 text-sm">{tutorial.duration}</div>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
              {tutorial.difficulty}
            </span>
          </div>
          <Link href={`/tutorials/${tutorial.id}`}>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-300">
              Commencer le tutoriel
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Composant pour un tutoriel standard
// Define the type for a tutorial
interface Tutorial {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  authorAvatar: string;
  date: string;
  duration: string;
  difficulty: string;
  featured: boolean;
}

const TutorialCard = ({ tutorial }: { tutorial: Tutorial }) => {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img 
          src={tutorial.image} 
          alt={tutorial.title} 
          className="w-full h-40 object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
            {tutorial.category}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{tutorial.title}</h3>
        <p className="text-gray-600 mb-4 text-sm line-clamp-2">{tutorial.excerpt}</p>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
              <img src={tutorial.authorAvatar} alt={tutorial.author} className="w-full h-full object-cover" />
            </div>
            <p className="text-gray-700 text-xs">{tutorial.author}</p>
          </div>
          <div className="text-gray-500 text-xs">{tutorial.duration}</div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
            {tutorial.difficulty}
          </span>
          <Link href={`/tutorials/${tutorial.id}`}>
            <button className="px-3 py-1 bg-gray-100 text-blue-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all duration-300">
              Voir tutoriel
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Composant principal de la page de tutoriels
export default function TutorialsPage() {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTutorials, setFilteredTutorials] = useState(TUTORIALS);
  
  // Extraire les catégories uniques
  const categories = [...new Set(TUTORIALS.map(tutorial => tutorial.category))];
  
  // Filtrer les tutoriels en fonction de la catégorie et de la recherche
  useEffect(() => {
    let result = TUTORIALS;
    
    if (activeCategory !== "Tous") {
      result = result.filter(tutorial => tutorial.category === activeCategory);
    }
    
    if (searchTerm) {
      result = result.filter(tutorial => 
        tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutorial.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredTutorials(result);
  }, [activeCategory, searchTerm]);
  
  // Séparer le tutoriel en vedette des autres tutoriels
  const featuredTutorial = TUTORIALS.find(tutorial => tutorial.featured);
  const regularTutorials = filteredTutorials.filter(tutorial => !tutorial.featured);
  
  return (
    <div className={`min-h-screen ${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}>
      {/* Hero section */}
      <div className="w-full bg-gradient-to-r from-blue-800 to-blue-600 py-16">
        <div className="container mx-auto max-w-5xl px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Tutoriels</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Développez vos compétences avec nos tutoriels pratiques et accessibles pour tous les niveaux.
          </p>
        </div>
      </div>
      
      {/* Contenu principal */}
      <div className="container mx-auto max-w-5xl px-6 py-8">
        {/* Barre de recherche */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Rechercher un tutoriel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute left-3 top-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        {/* Filtres par catégorie */}
        <Categories 
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
        
        {/* Tutoriel en vedette */}
        {featuredTutorial && !searchTerm && activeCategory === "Tous" && 
          <FeaturedTutorial tutorial={featuredTutorial} />
        }
        
        {/* Liste des tutoriels */}
        {regularTutorials.length > 0 ? (
          <>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {searchTerm ? "Résultats de recherche" : activeCategory !== "Tous" ? `Tutoriels ${activeCategory}` : "Tous les tutoriels"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {regularTutorials.map(tutorial => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white p-8 rounded-xl shadow text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Aucun tutoriel trouvé</h3>
            <p className="text-gray-600">Aucun tutoriel ne correspond à vos critères de recherche.</p>
          </div>
        )}
      </div>
      
      {/* Footer simplifié */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="container mx-auto max-w-5xl px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <h3 className="text-lg font-bold mb-3">Plateforme Éducative</h3>
              <p className="text-gray-400 text-sm">Votre partenaire pour l'apprentissage en ligne.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-3">Liens rapides</h3>
              <ul className="space-y-1 text-sm">
                <li><Link href="/courses" className="text-gray-400 hover:text-white transition-colors">Cours</Link></li>
                <li><Link href="/tutorials" className="text-gray-400 hover:text-white transition-colors">Tutoriels</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-3">Contact</h3>
              <ul className="space-y-1 text-sm">
                <li className="text-gray-400">contact@plateforme.com</li>
                <li className="text-gray-400">+33 1 23 45 67 89</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-3">Suivez-nous</h3>
              <div className="flex space-x-3">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>© 2025 Plateforme Éducative. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}