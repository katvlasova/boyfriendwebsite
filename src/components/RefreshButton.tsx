'use client';

export default function RefreshButton() {
  const handleClick = () => {
    window.location.reload();
  };

  return (
    <button 
      onClick={handleClick}
      className="w-full mt-8 bg-red-700 text-gray-200 font-semibold py-3 px-6 hover:bg-red-800 transition-all duration-300 border border-red-900 font-bebas tracking-wider text-2xl"
    >
      MEET ANOTHER BOYFRIEND
    </button>
  );
} 