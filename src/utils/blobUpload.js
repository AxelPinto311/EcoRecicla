
export const uploadImageToVercel = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('https://blob.vercel.com/api/blob/upload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_BLOB_READ_WRITE_TOKEN}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Error al subir la imagen a Vercel Blob');
  }

  const data = await res.json();
  return data.url;
};

