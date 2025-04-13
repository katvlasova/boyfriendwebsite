import Image from 'next/image';
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

function QuoteSection({ label, content }: { label: string; content: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-3 title-font text-red-600">{label}</h2>
      <p className="text-xl title-font">{content}</p>
    </div>
  );
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  
  // Match patterns:
  // - youtu.be/XXXXXXXXXXX
  // - youtube.com/watch?v=XXXXXXXXXXX
  // - youtube.com/embed/XXXXXXXXXXX
  // - youtu.be/XXXXXXXXXXX?si=...
  // - youtube.com/watch?v=XXXXXXXXXXX&...
  const patterns = [
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/embed\/([^?&]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  // If no patterns match but the string looks like a video ID (11 chars), return it
  if (/^[A-Za-z0-9_-]{11}$/.test(url)) {
    return url;
  }

  return null;
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

  // Filter for records that have all required fields AND a valid YouTube URL
  const validRecords = records.filter(record => {
    if (!record || record.length < 5) return false;
    if (!record.slice(0, 4).every(field => field?.trim())) return false;
    
    // Check if there's a valid YouTube URL
    const youtubeUrl = record[4]?.trim();
    return youtubeUrl && extractYouTubeId(youtubeUrl) !== null;
  });

  if (!validRecords.length) {
    throw new Error('No valid quotes with YouTube videos found');
  }

  // Get random record
  const record = validRecords[Math.floor(Math.random() * validRecords.length)];
  
  // Extract YouTube ID (we know it's valid from the filter above)
  const youtubeUrl = extractYouTubeId(record[4]);
  
  return {
    occupation: record[0],
    evilThing: record[1],
    reason: record[2],
    extraInfo: record[3],
    youtubeUrl
  };
}

export default async function Home() {
  const randomImage = images[Math.floor(Math.random() * images.length)];
  let quote: QuoteData;
  
  try {
    quote = await getRandomQuote();
  } catch (error) {
    console.error('Error loading quote:', error);
    return (
      <main className="min-h-screen bg-black text-white relative flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-6xl font-bold mb-12 title-font text-white">GAY EVIL BOYFRIEND</h1>
          <p className="text-xl mb-4">Something went wrong loading your evil boyfriend:</p>
          <p className="text-red-500 mb-8">{error instanceof Error ? error.message : 'Unknown error'}</p>
          <a 
            href="/"
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            GENERATE NEW EVIL BOYFRIEND
          </a>
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
        <h1 className="text-7xl font-bold text-center mb-12 title-font text-white">GAY EVIL BOYFRIEND</h1>
        <div className="max-w-4xl mx-auto bg-black/80 p-8 rounded-lg">
          <QuoteSection label="Occupation" content={quote.occupation} />
          <QuoteSection label="Most Evil Thing I've done" content={quote.evilThing} />
          <QuoteSection label="Why we should come into union" content={quote.reason} />
          <QuoteSection label="Something you should know" content={quote.extraInfo} />
          
          {quote.youtubeUrl && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-3 title-font text-red-600">I'm listening to</h2>
              <div className="relative pt-[56.25%]">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${quote.youtubeUrl}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
          
          <div className="mt-8 w-full">
            <a 
              href="/"
              className="bg-red-600 hover:bg-red-700 text-white text-2xl font-bold py-4 px-8 rounded block w-full text-center"
            >
              GENERATE NEW EVIL BOYFRIEND
            </a>
          </div>
        </div>
      </div>
    </main>
  );
} 