'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ImageUpload from '../../../../components/ImageUpload';

export default function EditProduct() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();

      setForm({
        name: data.name || '',
        slug: data.slug || '',
        price: data.price?.toString() || '',
        description: data.description || '',
        category: data.category || '',
        collection: data.collection || '',
        image: data.image || '',
      });

      if (data.image && typeof data.image === 'object' && data.image.sys?.id) {
        try {
          const assetId = data.image.sys.id;
          const assetRes = await fetch(`/api/contentful/asset/${assetId}`);
          const asset = await assetRes.json();
          const url = asset.fields?.file?.['en-US']?.url;
          if (url) setImageUrl(`https:${url}`);

          // Uppdatera form.image till ID:t så det blir rätt vid submit också
          setForm((prev: any) => ({ ...prev, image: assetId }));
        } catch (err) {
          console.error('Kunde inte ladda bild:', err);
        }
      }

    };

    fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (uploaded: { id: string; url: string }) => {
    setForm((prev: any) => ({ ...prev, image: uploaded.id }));
    setImageUrl(uploaded.url); // Direkt sätta förhandsvisning
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    router.push('/admin/products');
  };

  const handleDelete = async () => {
    const confirmed = confirm('Är du säker på att du vill ta bort produkten?');
    if (!confirmed) return;

    await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    });

    router.push('/admin/products');
  };

  if (!form) return <p>Laddar...</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Redigera Produkt</h1>

      {['name', 'slug', 'price', 'description', 'category', 'collection'].map((field) => (
        <div key={field} className="mb-4">
          <label className="block mb-1 capitalize">{field}</label>
          <input
            type="text"
            name={field}
            value={(form as any)[field]}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
      ))}

      {/* Nuvarande bildvisning */}
      {imageUrl && (
        <div className="mb-4">
          <label className="block mb-1">Nuvarande bild</label>
          <img
            src={imageUrl}
            alt="Produktbild"
            className="w-32 h-32 object-cover rounded"
          />
        </div>
      )}

      {/* Ladda upp ny bild */}
      <div className="mb-4">
        <label className="block mb-1">Uppdatera produktbild</label>
        <ImageUpload onUploaded={handleImageUpload} />
      </div>

      <div className="flex gap-4">
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Uppdatera
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Ta bort
        </button>
      </div>
    </form>
  );
}
