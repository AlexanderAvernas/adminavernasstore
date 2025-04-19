'use client';

import { useState } from 'react';

interface Props {
  onUploaded: (data: { id: string; url: string }) => void;
}

export default function ImageUpload({ onUploaded }: Props) {
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload/contentfulUploads', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Uppladdning misslyckades');
      }

      const data = await res.json();
      const asset = data.asset;
      const id = asset.sys.id;
      const url = `https:${asset.fields.file['en-US'].url}`;

      setPreviewUrl(url);
      onUploaded({ id, url });
    } catch (err) {
      console.error('Fel vid uppladdning:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
      {uploading && <p className="text-sm text-gray-500">Laddar upp...</p>}
      {previewUrl && (
        <div className="mt-2">
          <img src={previewUrl} alt="Förhandsvisning" className="max-w-xs rounded border" />
        </div>
      )}
    </div>
  );
}
