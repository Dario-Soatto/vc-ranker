import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Delete all existing data
    await sql`DELETE FROM funds`;
    
    // Reset the ID sequence to start from 1
    await sql`ALTER SEQUENCE funds_id_seq RESTART WITH 1`;

    return NextResponse.json({ 
      message: 'Database reset complete. Visit /api/seed to add new data.' 
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to reset database' }, { status: 500 });
  }
}