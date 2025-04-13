'use client';

import { useRouter } from 'next/navigation';

export default function RefreshButton() {
  const router = useRouter();

  return (
    <button 
      onClick={() => {
        router.refresh();
      }}
      className="w-full mt-8 bg-red-700 text-gray-200 font-semibold py-3 px-6 hover:bg-red-800 transition-all duration-300 border border-red-900 font-bebas tracking-wider text-2xl"
    >
      GENERATE NEW EVIL BOYFRIEND
    </button>
  );
} 