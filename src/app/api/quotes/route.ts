import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

// Force dynamic rendering and use Node.js runtime
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    // Read the CSV file from the public directory
    const filePath = path.join(process.cwd(), 'public', 'TestResponses_2.csv');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    // Parse all records
    const allRecords = parse(fileContent, {
      skip_empty_lines: true,
      from_line: 2, // Skip header row
      trim: true,
      columns: false
    }) as string[][];

    // Filter out any empty records and ensure all required fields are present
    const validRecords = allRecords.filter(record => {
      if (!record || record.length < 5) return false;
      return record[0]?.trim() && 
             record[1]?.trim() && 
             record[2]?.trim() && 
             record[3]?.trim();
    });

    if (validRecords.length === 0) {
      console.error('No valid records found in CSV');
      return NextResponse.json(
        { error: 'No valid quotes available' },
        { status: 500 }
      );
    }

    // Get a random record
    const randomRecord = validRecords[Math.floor(Math.random() * validRecords.length)];

    // Format the YouTube URL - only check column 5 (index 4)
    let youtubeUrl = null;
    const url = randomRecord[4]?.trim();
    if (url && (url.includes('youtube.com') || url.includes('youtu.be'))) {
      youtubeUrl = url;
    }

    // Return the random record in the correct format with CORS headers
    return NextResponse.json({
      occupation: randomRecord[0],
      evilThing: randomRecord[1],
      reason: randomRecord[2],
      extraInfo: randomRecord[3],
      youtubeUrl: youtubeUrl
    }, {
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      },
    });
  } catch (error) {
    console.error('Error reading CSV:', error);
    return NextResponse.json(
      { error: 'Failed to read quotes' },
      { status: 500 }
    );
  }
} 