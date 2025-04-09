// app/admin/products/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    router.push('/admin/products');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Ny Produkt</h1>
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
      <div className="mb-4">
        <label className="block mb-1">Bildens Asset ID (från Contentful)</label>
        <input
          type="text"
          name="image"
          value={form.image}
          onChange={handleChange}
          className="w-full border rounded p-2"
          placeholder="t.ex. 5RzF5kzNxxxxx"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Spara</button>
    </form>
  );
}
