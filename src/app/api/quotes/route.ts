import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { parse } from 'csv-parse/sync';
import path from 'path';

// Force dynamic rendering and use Node.js runtime
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

export async function GET() {
  try {
    // Log the current working directory and file path
    const cwd = process.cwd();
    const csvPath = path.join(cwd, 'public', 'TestResponses_2.csv');
    console.log('Current directory:', cwd);
    console.log('Looking for CSV at:', csvPath);

    // List files in public directory
    const publicFiles = await fs.readdir(path.join(cwd, 'public'));
    console.log('Files in public directory:', publicFiles);

    // Read CSV file
    const fileContent = await fs.readFile(csvPath, 'utf-8');
    console.log('Successfully read CSV file');
    
    // Parse CSV
    const records = parse(fileContent, {
      skip_empty_lines: true,
      from_line: 2,
      trim: true
    }) as string[][];
    console.log('Successfully parsed CSV, found', records.length, 'records');

    // Get random valid record
    const validRecords = records.filter((record: string[]) => 
      record.length >= 5 && 
      record[0]?.trim() && 
      record[1]?.trim() && 
      record[2]?.trim() && 
      record[3]?.trim()
    );
    console.log('Found', validRecords.length, 'valid records');

    if (!validRecords.length) {
      throw new Error('No valid records found');
    }

    const record = validRecords[Math.floor(Math.random() * validRecords.length)];
    console.log('Selected record:', { 
      occupation: record[0],
      evilThing: record[1].substring(0, 20) + '...',
      hasYouTube: !!record[4]?.trim()
    });

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

  } catch (error: any) {
    console.error('Detailed error:', {
      message: error?.message || 'Unknown error',
      stack: error?.stack || 'No stack trace',
      name: error?.name || 'Unknown error type'
    });
    return NextResponse.json({ error: 'Failed to get quote' }, { status: 500 });
  }
} 