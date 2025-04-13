import Image from 'next/image';
import RefreshButton from '@/components/RefreshButton';
import YouTubeEmbed from '@/components/YouTubeEmbed';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const images = [
  '/crt_scanline_high_contrast_bw_1.png',
  '/crt_scanline_high_contrast_bw_3.png',
  '/crt_scanline_high_contrast_bw_4.png'
];

interface QuoteData {
  occupation: string;
  evilThing: string;
  reason: string;
  extraInfo: string;
  youtubeUrl: string | null;
}

async function getRandomQuote(): Promise<QuoteData> {
  // Get the base URL from environment or use relative URL
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : 'http://localhost:3004';
    
  const response = await fetch(`${baseUrl}/api/quotes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    next: { revalidate: 0 }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch quote');
  }
  
  return response.json();
}

function QuoteSection({ label, content }: { label: string; content: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-2 title-font text-red-600">{label}</h2>
      <p className="text-lg title-font">{content}</p>
    </div>
  );
}

export default async function Home() {
  const quote = await getRandomQuote();
  const randomImage = images[Math.floor(Math.random() * images.length)];

  return (
    <main className="min-h-screen bg-black text-white relative">
      <div className="absolute inset-0 z-0">
        <Image
          src={randomImage}
          alt="Background"
          fill
          style={{ objectFit: 'cover', opacity: 0.5 }}
          priority
        />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <h1 className="text-6xl font-bold text-center mb-12 title-font text-white">GAY EVIL BOYFRIEND</h1>
        <div className="max-w-3xl mx-auto bg-black/80 p-8 rounded-lg">
          <QuoteSection label="Occupation" content={quote.occupation} />
          <QuoteSection label="Most Evil Thing I've done" content={quote.evilThing} />
          <QuoteSection label="Why we should come into union" content={quote.reason} />
          <QuoteSection label="Something you should know" content={quote.extraInfo} />
          
          {quote.youtubeUrl && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-2 title-font text-red-600">I'm listening to</h2>
              <YouTubeEmbed url={quote.youtubeUrl} />
            </div>
          )}
          
          <div className="mt-8 flex justify-center">
            <RefreshButton />
          </div>
        </div>
      </div>
    </main>
  );
} 