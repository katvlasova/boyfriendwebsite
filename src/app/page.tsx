import Image from 'next/image';
import { promises as fs } from 'fs';
import { parse } from 'csv-parse/sync';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
      <p className="text-xl font-sans">{content}</p>
    </div>
  );
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  
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

  if (/^[A-Za-z0-9_-]{11}$/.test(url)) {
    return url;
  }

  return null;
}

// Get random item excluding the last used one
function getRandomUnique<T>(arr: T[], lastUsed: T | null): T {
  if (arr.length === 1) return arr[0];
  
  let newItem: T;
  do {
    newItem = arr[Math.floor(Math.random() * arr.length)];
  } while (newItem === lastUsed && arr.length > 1);
  
  return newItem;
}

export default async function Home() {
  try {
    // Read CSV file
    const csvPath = path.join(process.cwd(), 'public', 'TestResponses_3.csv');
    const fileContent = await fs.readFile(csvPath, 'utf-8');
    const records = parse(fileContent, {
      skip_empty_lines: true,
      from_line: 2,
      trim: true
    }) as string[][];

    // Organize fields
    const validFields = {
      occupations: [] as string[],
      evilThings: [] as string[],
      reasons: [] as string[],
      extraInfos: [] as string[],
      youtubeUrls: [] as string[]
    };

    // Filter valid records
    records.forEach(record => {
      if (!record || record.length < 5) return;
      
      if (record[0]?.trim()) validFields.occupations.push(record[0].trim());
      if (record[1]?.trim()) validFields.evilThings.push(record[1].trim());
      if (record[2]?.trim()) validFields.reasons.push(record[2].trim());
      if (record[3]?.trim()) validFields.extraInfos.push(record[3].trim());
      
      const youtubeUrl = record[4]?.trim();
      if (youtubeUrl && extractYouTubeId(youtubeUrl) !== null) {
        validFields.youtubeUrls.push(youtubeUrl);
      }
    });

    // Check for valid data
    if (!validFields.occupations.length || 
        !validFields.evilThings.length || 
        !validFields.reasons.length || 
        !validFields.extraInfos.length || 
        !validFields.youtubeUrls.length) {
      throw new Error('Not enough valid data in CSV');
    }

    // Generate quote with random fields
    const quote: QuoteData = {
      occupation: validFields.occupations[Math.floor(Math.random() * validFields.occupations.length)],
      evilThing: validFields.evilThings[Math.floor(Math.random() * validFields.evilThings.length)],
      reason: validFields.reasons[Math.floor(Math.random() * validFields.reasons.length)],
      extraInfo: validFields.extraInfos[Math.floor(Math.random() * validFields.extraInfos.length)],
      youtubeUrl: extractYouTubeId(validFields.youtubeUrls[Math.floor(Math.random() * validFields.youtubeUrls.length)])
    };

    // Random background image
    const images = [
      '/crt_scanline_high_contrast_bw_1.png',
      '/crt_scanline_high_contrast_bw_3.png',
      '/crt_scanline_high_contrast_bw_4.png'
    ];
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
                MEET NEW BOYFRIEND
              </a>
            </div>
          </div>
        </div>
      </main>
    );

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
} 