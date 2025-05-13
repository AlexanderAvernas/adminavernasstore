'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ImageUpload from '../ImageUpload';

export default function EditProduct() {
  const router = useRouter();
  const id = (useParams() as { id: string }).id;
  const [form, setForm] = useState<any>(null);

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
        image: data.image?.sys?.id || '',
        image1: data.image1?.sys?.id || '',
        image2: data.image2?.sys?.id || '',
        image3: data.image3?.sys?.id || '',
        imagePreview: '',
        image1Preview: '',
        image2Preview: '',
        image3Preview: '',
      });

      // Hämta bild-URLs för preview
      const fetchImageUrl = async (assetId: string) => {
        if (!assetId) return null;
        const res = await fetch(`/api/contentful/asset/${assetId}`);
        const asset = await res.json();
        return `https:${asset.fields.file['en-US'].url}`;
      };

      const previews = await Promise.all([
        fetchImageUrl(data.image?.sys?.id),
        fetchImageUrl(data.image1?.sys?.id),
        fetchImageUrl(data.image2?.sys?.id),
        fetchImageUrl(data.image3?.sys?.id),
      ]);

      setForm((prev: any) => ({
        ...prev,
        imagePreview: previews[0],
        image1Preview: previews[1],
        image2Preview: previews[2],
        image3Preview: previews[3],
      }));
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (field: 'image' | 'image1' | 'image2' | 'image3') => (data: { id: string; url: string }) => {
    setForm((prev: any) => ({
      ...prev,
      [field]: data.id,
      [`${field}Preview`]: data.url,
    }));
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

      {/* Main Image */}
      <div className="mb-4">
        <label className="block mb-1">Huvudbild</label>
        {form.imagePreview && (
          <img src={form.imagePreview} alt="Huvudbild" className="w-32 h-32 object-cover rounded mb-2" />
        )}
        <ImageUpload onUploaded={handleImageUpload('image')} />
      </div>

      {/* Extra Images */}
     {['image1', 'image2', 'image3'].map((field) => (
  <div key={field} className="mb-4">
    <label className="block mb-1">Extra bild {field.slice(-1)}</label>
    {(form as any)[`${field}Preview`] && (
      <div className="mb-2">
        <img
          src={(form as any)[`${field}Preview`]}
          alt="Extra bild"
          className="w-32 h-32 object-cover rounded"
        />
        <button
          type="button"
          onClick={() =>
            setForm((prev: any) => ({
              ...prev,
              [field]: '',
              [`${field}Preview`]: '',
            }))
          }
          className="text-sm text-red-600 mt-1 underline"
        >
          Radera bild
        </button>
      </div>
    )}
    <ImageUpload onUploaded={handleImageUpload(field as any)} />
  </div>
))}


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
