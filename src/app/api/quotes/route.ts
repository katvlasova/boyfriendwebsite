import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export async function GET() {
  try {
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

    // Return a random quote
    const randomQuote = {
      occupation: validOccupations[Math.floor(Math.random() * validOccupations.length)],
      evilThing: validEvilThings[Math.floor(Math.random() * validEvilThings.length)],
      reason: validReasons[Math.floor(Math.random() * validReasons.length)],
      extraInfo: validExtraInfo[Math.floor(Math.random() * validExtraInfo.length)],
      youtubeUrl: validYoutubeUrls[Math.floor(Math.random() * validYoutubeUrls.length)],
    };

    return NextResponse.json(randomQuote);
  } catch (error) {
    console.error('Error reading CSV:', error);
    return NextResponse.json(
      { error: 'Failed to read quotes' },
      { status: 500 }
    );
  }
} 