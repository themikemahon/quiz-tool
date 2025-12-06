import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const quizId = parseInt(params.id)

    await sql`DELETE FROM result_tiers WHERE quiz_id = ${quizId}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting result tiers:', error)
    return NextResponse.json(
      { error: 'Failed to delete result tiers' },
      { status: 500 }
    )
  }
}
