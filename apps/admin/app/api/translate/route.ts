import { NextRequest, NextResponse } from 'next/server'

// Using MyMemory Translation API (free, no API key required for basic usage)
// Limit: 1000 words/day per IP without API key
// You can get a free API key at https://mymemory.translated.net/doc/keygen.php for higher limits

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage } = await request.json()

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: 'Missing text or targetLanguage' },
        { status: 400 }
      )
    }

    // Map our language codes
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

    // Encode text for URL
    const encodedText = encodeURIComponent(text)
    const langPair = `en|${targetLang}`
    
    // Call MyMemory Translation API
    const apiUrl = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${langPair}`
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Translation API request failed')
    }

    const data = await response.json()
    
    if (data.responseStatus !== 200) {
      throw new Error(data.responseDetails || 'Translation failed')
    }
    
    return NextResponse.json({ translatedText: data.responseData.translatedText })
  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { error: 'Translation failed. Please try again or enter translations manually.' },
      { status: 500 }
    )
  }
}
