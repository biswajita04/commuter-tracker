import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT NOW() as current_time');
    return NextResponse.json({ 
      success: true, 
      message: 'Successfully connected to Aiven PostgreSQL!', 
      time: result.rows[0].current_time 
    }, { status: 200 });
  } catch (error: any) {
    console.error('Database connection error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}