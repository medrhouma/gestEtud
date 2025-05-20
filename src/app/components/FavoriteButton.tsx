'use client';
import { useState, useEffect } from 'react';

type Props = {
  userId: string;
  formationId: string;
};

export default function FavoriteButton({ userId, formationId }: Props) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Vérifie si cette formation est dans les favoris de l'utilisateur
    fetch(`http://localhost:8081/api/favorites/${userId}`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(
          (fav: any) =>
            fav.contentId === formationId && fav.contentType === 'formation'
        );
        setIsFavorite(!!found);
      })
      .catch(() => setIsFavorite(false));
  }, [userId, formationId]);

  const handleToggleFavorite = async () => {
    if (isFavorite) {
      // Supprimer la formation des favoris
      await fetch(
        `http://localhost:8081/api/favorites/${userId}/${formationId}`,
        { method: 'DELETE' }
      );
      setIsFavorite(false);
    } else {
      // Ajouter la formation aux favoris
      await fetch('http://localhost:8081/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          contentId: formationId,
          contentType: 'formation',
        }),
      });
      setIsFavorite(true);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      className={`p-2 rounded ${
        isFavorite ? 'bg-red-600' : 'bg-green-600'
      } text-white`}
    >
      {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    </button>
  );
}
