import { NextRequest, NextResponse } from 'next/server'

// Using LibreTranslate (free, open-source translation API)
// You can self-host or use their public instance
const TRANSLATE_API_URL = process.env.TRANSLATE_API_URL || 'https://libretranslate.com/translate'

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage } = await request.json()

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: 'Missing text or targetLanguage' },
        { status: 400 }
      )
    }

    // Map our language codes to LibreTranslate codes
    const langMap: Record<string, string> = {
      en: 'en',
      fr: 'fr',
      de: 'de',
    }

    const targetLang = langMap[targetLanguage]
    if (!targetLang) {
      return NextResponse.json(
        { error: 'Unsupported language' },
        { status: 400 }
      )
    }

    // Call translation API
    const response = await fetch(TRANSLATE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: targetLang,
        format: 'text',
      }),
    })

    if (!response.ok) {
      throw new Error('Translation API request failed')
    }

    const data = await response.json()
    
    return NextResponse.json({ translatedText: data.translatedText })
  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    )
  }
}
