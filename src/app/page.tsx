// app/page.tsx

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-semibold">
          <Link href="/admin/products" className="text-blue-600 hover:underline">
            Product
          </Link>
        </h1>
        <h1 className="text-3xl font-semibold text-gray-500">Bild första sida</h1>
        <h1 className="text-3xl font-semibold text-gray-500">Bilder kategorier</h1>
      </div>
    </main>
  );
}
