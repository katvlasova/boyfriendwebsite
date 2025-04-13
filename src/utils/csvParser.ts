import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export interface QuoteData {
  occupation: string;
  evilThing: string;
  reason: string;
  extraInfo: string;
  youtubeUrl: string | null;
}

function getRandomItem<T>(items: T[], defaultValue: T): T {
  if (items.length === 0) return defaultValue;
  return items[Math.floor(Math.random() * items.length)];
}

export function getRandomQuotes(): QuoteData {
  const filePath = path.join(process.cwd(), 'public', 'TestResponses_2.csv');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  // Parse all records
  const allRecords = parse(fileContent, {
    skip_empty_lines: true,
    from_line: 2, // Skip header row
  }) as string[][];

  // Get valid values for each column
  const validOccupations = allRecords
    .map(record => record[0]?.trim())
    .filter((text): text is string => !!text);

  const validEvilThings = allRecords
    .map(record => record[1]?.trim())
    .filter((text): text is string => !!text);

  const validReasons = allRecords
    .map(record => record[2]?.trim())
    .filter((text): text is string => !!text);

  const validExtraInfo = allRecords
    .map(record => record[3]?.trim())
    .filter((text): text is string => !!text);

  // Get all valid YouTube URLs from column 5
  const validYoutubeUrls = allRecords
    .map((record: string[]) => record[4]?.trim())
    .filter((url: string | undefined): url is string => {
      if (!url) return false;
      try {
        const urlObj = new URL(url);
        return urlObj.hostname.includes('youtube.com') || urlObj.hostname === 'youtu.be';
      } catch {
        return false;
      }
    });

  return {
    occupation: getRandomItem(validOccupations, 'Mystery occupation'),
    evilThing: getRandomItem(validEvilThings, 'Too evil to mention'),
    reason: getRandomItem(validReasons, 'Just because'),
    extraInfo: getRandomItem(validExtraInfo, 'It\'s a mystery'),
    youtubeUrl: getRandomItem(validYoutubeUrls, null),
  };
} 