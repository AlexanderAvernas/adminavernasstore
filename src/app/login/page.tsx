'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      username: userInfo.username,
      password: userInfo.password,
    });

    if (res?.ok) {
      router.push('/');
    } else {
      setError('Fel användarnamn eller lösenord');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-40 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Logga in</h1>

      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      <input
        type="text"
        placeholder="Användarnamn"
        value={userInfo.username}
        onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })}
        className="w-full p-2 border rounded mb-4"
      />

      <input
        type="password"
        placeholder="Lösenord"
        value={userInfo.password}
        onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
        className="w-full p-2 border rounded mb-4"
      />

      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
        Logga in
      </button>
    </form>
  );
}
