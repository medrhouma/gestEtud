'use client';
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">Bienvenue sur la plateforme étudiant</h1>
      <p className="mt-4 text-lg text-gray-700">
        Connectez-vous ou inscrivez-vous pour explorer les formations.
      </p>

      <div className="mt-6 flex gap-4">
        <Link href="/login">
          <button className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-700">
            Se connecter
          </button>
        </Link>
        <Link href="/signup">
          <button className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-700">
            S'inscrire
          </button>
        </Link>
      </div>
    </div>
  );
}