// app/page.tsx

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center space-y-4">
        <Link href="/admin/products">
          <button className="text-lg bg-blue-600 text-white px-6 py-3 m-3 rounded shadow hover:bg-blue-700 transition">
            🛒 Produkter
          </button>
        </Link>

        <button
          className="text-lg bg-gray-300 text-gray-700 px-6 py-3 rounded shadow cursor-not-allowed"
          disabled
        >
          🖼️ Bild – Första sidan (ej klar)
        </button>

        <button
          className="text-lg bg-gray-300 text-gray-700 px-6 py-3 rounded shadow cursor-not-allowed"
          disabled
        >
          🗂️ Bilder – Kategorier (ej klar)
        </button>
      </div>
    </main>
  );
}
