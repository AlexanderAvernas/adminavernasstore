'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '../../../components/ImageUpload'; // Anpassa denna importväg vid behov

export default function NewProduct() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    slug: '',
    price: '',
    description: '',
    category: '',
    collection: '',
    image: '',
    imageUrl: '', // används bara för preview
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (imageData: { id: string; url: string }) => {
    setForm((prev) => ({
      ...prev,
      image: imageData.id,      // Asset ID för Contentful
      imageUrl: imageData.url,  // används för förhandsvisning
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push('/admin/products');
    } else {
      const err = await res.json();
      alert(`Fel vid sparning: ${err.error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Ny Produkt</h1>

      {['name', 'slug', 'price', 'description', 'category', 'collection'].map((field) => (
        <div key={field} className="mb-4">
          <label className="block mb-1 capitalize">{field}</label>
          <input
            type={field === 'price' ? 'number' : 'text'}
            name={field}
            value={(form as any)[field]}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
      ))}

      <div className="mb-4">
        <label className="block mb-1">Ladda upp bild</label>
        <ImageUpload onUploaded={handleImageUpload} />
      </div>

      {form.imageUrl && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">Förhandsvisning:</p>
          <img src={form.imageUrl} alt="Förhandsvisning" className="max-w-xs rounded border" />
        </div>
      )}

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Spara
      </button>
    </form>
  );
}
