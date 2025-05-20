"use client";

import { useState } from "react";

type Book = {
  id: number;
  title: string;
  price: number;
  category: string;
  availability: string;
};

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [summaries, setSummaries] = useState<{ [key: string]: string }>({});
  const [selectedBook, setSelectedBook] = useState<Book | null>(null); // Pour la modale

  const handleScrape = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/scrape_books", {
        method: "POST",
      });
      if (!res.ok) throw new Error("Erreur lors du scraping");
      const data = await res.json();
      setMessage(data.message);
      fetchBooks();
    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/recommendations");
      if (!res.ok) throw new Error("Erreur lors de la récupération des livres");
      const data = await res.json();
      setBooks(data);
    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const getSummary = async (book: Book) => {
    setSelectedBook(book);

    // Si le résumé est déjà généré, pas besoin de le recharger
    if (summaries[book.title]) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`http://127.0.0.1:8000/books/summary?title=${encodeURIComponent(book.title)}`);
      if (!res.ok) throw new Error("Erreur lors de la récupération du résumé");
      const data = await res.json();

      setSummaries((prev) => ({
        ...prev,
        [book.title]: data.summary,
      }));
    } catch (err: any) {
      setError(err.message || "Impossible de charger le résumé");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedBook(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg space-y-8">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 tracking-tight">
        Recommandations de livres
      </h1>

      <div className="flex justify-center gap-6 flex-wrap">
        <button
          onClick={handleScrape}
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-md hover:shadow-lg transform transition hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Chargement..." : "Lancer le scraping"}
        </button>
        <button
          onClick={fetchBooks}
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-md hover:shadow-lg transform transition hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Chargement..." : "Charger les livres"}
        </button>
      </div>

      {error && (
        <div className="text-center text-red-600 font-semibold text-lg bg-red-100 p-3 rounded-lg animate-pulse">
          {error}
        </div>
      )}
      {message && (
        <div className="text-center text-green-700 font-semibold text-lg bg-green-100 p-3 rounded-lg">
          {message}
        </div>
      )}

      {books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out"
            >
              <h2 className="text-2xl font-bold mb-3 text-indigo-900 truncate">{book.title}</h2>

              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium">Prix :</span> £{book.price.toFixed(2)}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Catégorie :</span> {book.category}
                </p>
                <p
                  className={`font-medium ${
                    book.availability.toLowerCase().includes("in stock")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  Disponibilité : {book.availability}
                </p>
              </div>

              {/* Bouton qui ouvre la modale */}
              <button
                onClick={() => getSummary(book)}
                className="mt-5 w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                Voir le résumé
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-xl font-medium py-10 bg-white rounded-xl shadow-inner">
          Aucun livre à afficher. Cliquez sur “Charger les livres” après le scraping.
        </div>
      )}

      {/* MODALE POUR LE RÉSUMÉ */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative animate-fadeIn">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">{selectedBook.title}</h2>

            <div className="mt-4">
              {loading && <p className="text-gray-500 italic">Génération du résumé...</p>}
              {summaries[selectedBook.title] ? (
                <p className="text-gray-700 italic leading-relaxed">{summaries[selectedBook.title]}</p>
              ) : (
                <p className="text-gray-500 italic">Le résumé est en cours de génération…</p>
              )}
            </div>

            <button
              onClick={closeModal}
              className="mt-6 w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}