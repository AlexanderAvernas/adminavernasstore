// app/components/Navbar.tsx

'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="bg-gray-100 border-b p-4 flex justify-between items-center">
      <div className="flex gap-2">
        <button
          onClick={() => router.back()}
          className="text-sm px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
        >
          ← Tillbaka
        </button>
        <button
          onClick={() => router.push('/')}
          className="text-sm px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded"
        >
          🏠 Hem
        </button>
      </div>

      <button
        onClick={() => signOut({ callbackUrl: '/login' })}
        className="text-sm px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded"
      >
        Logga ut
      </button>
    </nav>
  );
}
