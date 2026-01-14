import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import type { BrandTheme } from '@quiz-tool/shared/types';

/**
 * GET /api/brand-themes
 * 
 * Returns all available brand themes from the database.
 * These themes can be applied to quizzes for brand-specific styling.
 */
export async function GET() {
  try {
    const { rows } = await sql<BrandTheme>`
      SELECT * FROM brand_themes 
      ORDER BY name
    `;
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching brand themes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brand themes' },
      { status: 500 }
    );
  }
}
