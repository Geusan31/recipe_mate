const API_BASE_URL = 'http://localhost:3000/recipes';

export async function fetchRecipes(search = '', category = '') {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (category) params.set('category', category);

  const query = params.toString() ? `?${params.toString()}` : '';
  const response = await fetch(`${API_BASE_URL}${query}`);
  if (!response.ok) {
    throw new Error(`Gagal memuat resep dari server (Status: ${response.status})`);
  }
  return response.json();
}

export async function fetchRecipeById(idOrSlug) {
  const response = await fetch(`${API_BASE_URL}/${idOrSlug}`);
  if (!response.ok) {
    throw new Error(`Resep dengan ID/slug ${idOrSlug} tidak ditemukan`);
  }
  return response.json();
}

export async function createRecipe(data) {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  });

  const body = await response.json();
  if (!response.ok) {
    const errorMsg = Array.isArray(body.message)
      ? body.message.join(', ')
      : body.message || 'Gagal menambahkan resep';
    throw new Error(errorMsg);
  }
  return body;
}

export async function updateRecipe(idOrSlug, data) {
  const response = await fetch(`${API_BASE_URL}/${idOrSlug}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  });

  const body = await response.json();
  if (!response.ok) {
    const errorMsg = Array.isArray(body.message)
      ? body.message.join(', ')
      : body.message || 'Gagal memperbarui resep';
    throw new Error(errorMsg);
  }
  return body;
}

export async function deleteRecipe(idOrSlug) {
  const response = await fetch(`${API_BASE_URL}/${idOrSlug}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
    },
  });

  const body = await response.json();
  if (!response.ok) {
    const errorMsg = Array.isArray(body.message)
      ? body.message.join(', ')
      : body.message || 'Gagal menghapus resep';
    throw new Error(errorMsg);
  }
  return body;
}
