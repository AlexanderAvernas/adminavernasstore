// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import ImageUpload from '../../../components/ImageUpload'; // Korrigera vägen vid behov

// export default function NewProduct() {
//   const router = useRouter();
//   const [form, setForm] = useState({
//     name: '',
//     slug: '',
//     price: '',
//     description: '',
//     category: '',
//     collection: '',
//     image: '',
//     image1: '',
//     image2: '',
//     image3: '',
//     imagePreview: '',
//     image1Preview: '',
//     image2Preview: '',
//     image3Preview: '',
//   });

//   const [errors, setErrors] = useState<{ [key: string]: string }>({});

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;

//     // Enkel validering
//     const newErrors: any = { ...errors };

//     if (name === 'slug') {
//       if (/\s/.test(value)) {
//         newErrors.slug = 'Slug får inte innehålla mellanslag.';
//       } else {
//         delete newErrors.slug;
//       }
//     }

//     if (name === 'category') {
//       if (/[A-Z]/.test(value)) {
//         newErrors.category = 'Kategori ska endast innehålla små bokstäver.';
//       } else {
//         delete newErrors.category;
//       }
//     }

//     setErrors(newErrors);
//     setForm({ ...form, [name]: value });
//   };

//   const handleImageUpload = (field: 'image' | 'image1' | 'image2' | 'image3') => (data: { id: string; url: string }) => {
//     setForm((prev) => ({
//       ...prev,
//       [field]: data.id,
//       [`${field}Preview`]: data.url,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Kontrollera om det finns valideringsfel innan submit
//     if (Object.keys(errors).length > 0) {
//       alert('Rätta till felen innan du skickar in.');
//       return;
//     }

//     const res = await fetch('/api/products', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(form),
//     });

//     if (res.ok) {
//       router.push('/admin/products');
//     } else {
//       const err = await res.json();
//       alert(`Fel vid sparning: ${err.error}`);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4">Ny Produkt</h1>

//       {['name', 'slug', 'price', 'description', 'category', 'collection'].map((field) => (
//         <div key={field} className="mb-4">
//           <label className="block mb-1 capitalize">{field}</label>
//           <input
//             type={field === 'price' ? 'number' : 'text'}
//             name={field}
//             value={(form as any)[field]}
//             onChange={handleChange}
//             className={`w-full border rounded p-2 ${
//               errors[field] ? 'border-red-500' : 'border-gray-300'
//             }`}
//           />
//           {field === 'slug' && (
//             <p className="text-sm text-gray-500">Endast små bokstäver och bindestreck. Inga mellanslag.</p>
//           )}
//           {field === 'category' && (
//             <p className="text-sm text-gray-500">Skriv endast med små bokstäver, t.ex. <code>kläder</code>.</p>
//           )}
//           {errors[field] && <p className="text-sm text-red-600">{errors[field]}</p>}
//         </div>
//       ))}

//       {/* Main Image */}
//       <div className="mb-4">
//         <label className="block mb-1">Huvudbild</label>
//         <ImageUpload onUploaded={handleImageUpload('image')} />
//         {form.imagePreview && (
//           <img src={form.imagePreview} alt="Preview" className="mt-2 max-w-xs rounded border" />
//         )}
//       </div>

//       {/* Extra Images */}
//       {['image1', 'image2', 'image3'].map((field) => (
//         <div key={field} className="mb-4">
//           <label className="block mb-1">Extra bild {field.slice(-1)}</label>
//           <ImageUpload onUploaded={handleImageUpload(field as any)} />
//           {(form as any)[`${field}Preview`] && (
//             <img src={(form as any)[`${field}Preview`]} alt="Preview" className="mt-2 max-w-xs rounded border" />
//           )}
//         </div>
//       ))}

//       <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
//         Spara
//       </button>
//     </form>
//   );
// }
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import NewProduct from '../../../components/admin/NewProduct'; // Flytta NewProduct till en komponentmapp

export default async function ProtectedNewProductPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }

  return <NewProduct />;
}
