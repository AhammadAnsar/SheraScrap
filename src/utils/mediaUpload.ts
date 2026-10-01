export async function mediaFetch(url: string, init: RequestInit = {}) {
  const { auth } = await import('../lib/firebase');
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error('Please sign in again to manage media.');
  return fetch(url, { ...init, headers: { ...init.headers, Authorization: `Bearer ${token}` } });
}

export async function uploadImage(file: File) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Use a JPEG, PNG or WebP image.');
  if (file.size > 3 * 1024 * 1024) throw new Error('Image must be 3 MB or smaller.');
  const image = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const response = await mediaFetch('/api/upload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image, name: file.name }) });
  const data = await response.json();
  if (!response.ok || !data.success || !data.url) throw new Error(data.error || 'Upload failed. Please retry.');
  return data;
}
