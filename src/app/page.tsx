import Image from 'next/image';
import RefreshButton from '@/components/RefreshButton';
import YouTubeEmbed from '@/components/YouTubeEmbed';
import { promises as fs } from 'fs';
import { parse } from 'csv-parse/sync';
import path from 'path';

// List of background images
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
  // Read CSV file directly
  const csvPath = path.join(process.cwd(), 'public', 'TestResponses_2.csv');
  const fileContent = await fs.readFile(csvPath, 'utf-8');
  
  // Parse CSV and get valid records
  const records = parse(fileContent, {
    skip_empty_lines: true,
    from_line: 2,
    trim: true
  }) as string[][];

  const validRecords = records.filter(record => 
    record.length >= 5 && 
    record.slice(0, 4).every(field => field?.trim())
  );

  if (!validRecords.length) {
    throw new Error('No valid quotes found');
  }

  // Get random record
  const record = validRecords[Math.floor(Math.random() * validRecords.length)];
  
  return {
    occupation: record[0],
    evilThing: record[1],
    reason: record[2],
    extraInfo: record[3],
    youtubeUrl: record[4]?.trim() || null
  };
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
  const randomImage = images[Math.floor(Math.random() * images.length)];
  console.log('Selected background image:', randomImage);
  
  let quote: QuoteData;
  
  try {
    quote = await getRandomQuote();
    console.log('Successfully loaded quote:', {
      occupation: quote.occupation,
      hasYouTube: Boolean(quote.youtubeUrl)
    });
  } catch (error) {
    console.error('Error loading quote:', error);
    return (
      <main className="min-h-screen bg-black text-white relative flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-6xl font-bold mb-12 title-font text-white">GAY EVIL BOYFRIEND</h1>
          <p className="text-xl mb-4">Something went wrong loading your evil boyfriend:</p>
          <p className="text-red-500 mb-8">{error instanceof Error ? error.message : 'Unknown error'}</p>
          <RefreshButton />
        </div>
      </main>
    );
  }

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