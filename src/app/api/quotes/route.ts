import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import path from 'path';

// Force dynamic rendering and use Node.js runtime
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

export async function GET() {
  try {
    // Read CSV directly from public directory
    const csvPath = path.join(process.cwd(), 'public', 'TestResponses_2.csv');
    const fileContent = readFileSync(csvPath, 'utf-8');
    
    // Parse CSV
    const records = parse(fileContent, {
      skip_empty_lines: true,
      from_line: 2,
      trim: true
    }) as string[][];

    // Get random valid record
    const validRecords = records.filter((record: string[]) => 
      record.length >= 5 && 
      record[0]?.trim() && 
      record[1]?.trim() && 
      record[2]?.trim() && 
      record[3]?.trim()
    );

    if (!validRecords.length) {
      throw new Error('No valid records found');
    }

    const record = validRecords[Math.floor(Math.random() * validRecords.length)];

    return NextResponse.json({
      occupation: record[0],
      evilThing: record[1],
      reason: record[2],
      extraInfo: record[3],
      youtubeUrl: record[4]?.trim() || null
    }, {
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to get quote' }, { status: 500 });
  }
} 