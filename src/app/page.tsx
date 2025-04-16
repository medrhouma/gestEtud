'use client';
import React from 'react';
import Link from 'next/link';
import { Geist, Geist_Mono } from 'next/font/google';

// Définir les polices comme dans les autres pages
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function HomePage() {
  return (
    <div
      className={`flex flex-col min-h-screen bg-gray-50 ${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      {/* Hero Banner */}
      <div
        className="relative w-full h-[400px] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Votre avenir commence ici
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto">
            Explorez des formations de pointe et développez vos compétences avec notre plateforme éducative.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link href="/signup">
              <button className="px-6 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transform hover:scale-105 transition-all duration-300">
                S'inscrire
              </button>
            </Link>
            <Link href="/login">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transform hover:scale-105 transition-all duration-300">
                Se connecter
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex flex-col items-center py-12 px-6">
        <div className="w-full max-w-3xl">
          {/* Carte de bienvenue */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12">
            <div className="bg-blue-600 px-6 py-6 text-center">
              <h2 className="text-3xl font-bold text-white">Bienvenue sur la Plateforme Étudiant</h2>
            </div>
            <div className="p-8 text-center">
              <p className="text-gray-600 text-lg mb-6">
                Notre plateforme vous permet de gérer votre profil, de choisir des formations, et de suivre des cours spécialisés dans divers domaines comme le développement web, l’intelligence artificielle, et bien plus encore.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                
                <Link href="/profile">
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transform hover:scale-105 transition-all duration-300">
                    Voir mon profil
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Section des statistiques */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">
              Pourquoi choisir notre plateforme ?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-4xl font-bold text-blue-600">10,000+</p>
                <p className="text-gray-600 mt-2">Étudiants inscrits</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-blue-600">50+</p>
                <p className="text-gray-600 mt-2">Cours disponibles</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-blue-600">9</p>
                <p className="text-gray-600 mt-2">Formations spécialisées</p>
              </div>
            </div>
          </div>

          {/* Section des témoignages */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">
              Ce que disent nos étudiants
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="text-center">
                <p className="text-gray-600 italic">
                  "Cette plateforme m’a permis de maîtriser le développement web en seulement quelques mois. Les cours sont clairs et bien structurés !"
                </p>
                <p className="mt-4 font-semibold text-blue-700">Sarah M., Étudiante en DSI</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600 italic">
                  "Grâce aux formations en IA, j’ai pu décrocher un stage dans une entreprise tech. Je recommande vivement !"
                </p>
                <p className="mt-4 font-semibold text-blue-700">Ahmed T., Étudiant en Informatique</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}