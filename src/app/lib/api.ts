const API_URL = 'http://localhost:8081/api/favorites';

export async function addFavorite(favorite: {
  userId: string;
  contentId: string;
  contentType: string;
}) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(favorite),
  });
  return await res.json();
}

export async function getFavorites(userId: string) {
  const res = await fetch(`${API_URL}/${userId}`);
  return await res.json();
}

export async function removeFavorite(userId: string, contentId: string) {
  await fetch(`${API_URL}/${userId}/${contentId}`, {
    method: 'DELETE',
  });
}
