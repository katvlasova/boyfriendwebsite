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

async function getRandomQuote() {
  const res = await fetch('/api/quotes', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch quote');
  }
  return res.json();
}

export default async function Home() {
  const randomQuote = await getRandomQuote();
  const randomImage = images[Math.floor(Math.random() * images.length)];

  return (
    <main className="min-h-screen bg-black pt-0 px-4 sm:px-8 pb-8">
      <div className="max-w-2xl mx-auto bg-black">
        <h1 className="text-[3.85rem] sm:text-[5.5rem] font-bold text-center text-white bg-black font-bebas tracking-[-0.01em] leading-none py-2 w-full">
          GAY EVIL BOYFRIEND
        </h1>

        <div className="px-4 sm:p-8">
          <div className="relative w-full max-w-sm mx-auto">
            <div className="relative aspect-square w-full">
              <Image
                src={randomImage}
                alt="Evil Boyfriend Reference"
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
                priority
              />
            </div>
          </div>
          
          <div className="space-y-4 mt-4">
            <QuoteSection
              heading="Occupation"
              content={randomQuote.occupation}
            />
            
            <QuoteSection
              heading="Most evil thing I've done"
              content={randomQuote.evilThing}
            />
            
            <QuoteSection
              heading="We should get together because"
              content={randomQuote.reason}
            />
            
            <QuoteSection
              heading="Something else you should know"
              content={randomQuote.extraInfo}
            />

            {randomQuote.youtubeUrl && (
              <div className="bg-black px-4 sm:px-6 py-3">
                <h2 className="text-lg sm:text-xl font-semibold text-red-700 mb-2 sm:mb-3 flex items-center gap-2 font-bebas tracking-wider">
                  I'M LISTENING TO:
                </h2>
                <div className="text-lg text-gray-300">
                  <YouTubeEmbed url={randomQuote.youtubeUrl} />
                </div>
              </div>
            )}

            <RefreshButton />
          </div>
        </div>
      </div>
    </main>
  );
}

function QuoteSection({ heading, content }: { heading: string; content: string }) {
  return (
    <div className="bg-black px-4 sm:px-6 py-3">
      <h2 className="text-lg sm:text-xl font-semibold text-red-700 mb-2 sm:mb-3 flex items-center gap-2 font-bebas tracking-wider">
        {heading}:
      </h2>
      <p className="text-base sm:text-lg text-gray-300 max-h-[150px] sm:max-h-[200px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-red-700 scrollbar-track-black">
        {content}
      </p>
    </div>
  );
} 