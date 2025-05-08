const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchUserProfile() {
  const res = await fetch(`${API_BASE_URL}/user/profile`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch user profile');
  return res.json();
}

export async function updateUserProfile(data) {
  const res = await fetch(`${API_BASE_URL}/user/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update user profile');
  return res.json();
} 