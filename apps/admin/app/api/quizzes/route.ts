import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import type { Quiz } from '@quiz-tool/shared/types'

export async function GET() {
  try {
    const { rows } = await sql<Quiz>`
      SELECT * FROM quizzes 
      ORDER BY updated_at DESC
    `
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Error fetching quizzes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quizzes' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      title, description, template_type, status,
      title_fr, title_de, description_fr, description_de,
      brand_theme_id,
      cta_enabled, cta_text, cta_text_fr, cta_text_de, cta_url, cta_mobile_url
    } = body

    const { rows } = await sql<Quiz>`
      INSERT INTO quizzes (
        title, description, template_type, status,
        title_fr, title_de, description_fr, description_de,
        brand_theme_id,
        cta_enabled, cta_text, cta_text_fr, cta_text_de, cta_url, cta_mobile_url
      )
      VALUES (
        ${title}, 
        ${description}, 
        ${template_type || 'scam-detector'}, 
        ${status || 'draft'},
        ${title_fr || null},
        ${title_de || null},
        ${description_fr || null},
        ${description_de || null},
        ${brand_theme_id || null},
        ${cta_enabled || false},
        ${cta_text || null},
        ${cta_text_fr || null},
        ${cta_text_de || null},
        ${cta_url || null},
        ${cta_mobile_url || null}
      )
      RETURNING *
    `

    return NextResponse.json(rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating quiz:', error)
    return NextResponse.json(
      { error: 'Failed to create quiz' },
      { status: 500 }
    )
  }
}
