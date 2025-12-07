import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import type { ResultTier } from '@quiz-tool/shared/types'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      quiz_id, tier_name, min_percentage, max_percentage, message, order_index,
      tier_name_fr, tier_name_de, message_fr, message_de
    } = body

    const { rows } = await sql<ResultTier>`
      INSERT INTO result_tiers (
        quiz_id, tier_name, min_percentage, max_percentage, message, order_index,
        tier_name_fr, tier_name_de, message_fr, message_de
      )
      VALUES (
        ${quiz_id}, ${tier_name}, ${min_percentage}, ${max_percentage}, ${message}, ${order_index},
        ${tier_name_fr || null}, ${tier_name_de || null}, ${message_fr || null}, ${message_de || null}
      )
      RETURNING *
    `

    return NextResponse.json(rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating result tier:', error)
    return NextResponse.json(
      { error: 'Failed to create result tier' },
      { status: 500 }
    )
  }
}
