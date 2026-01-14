'use client'

interface CTAButtonProps {
  ctaText?: string
  ctaTextFr?: string
  ctaTextDe?: string
  ctaUrl: string
  ctaMobileUrl?: string
  language?: string
  embedMode?: boolean
}

export default function CTAButton({
  ctaText,
  ctaTextFr,
  ctaTextDe,
  ctaUrl,
  ctaMobileUrl,
  language = 'en',
  embedMode = false
}: CTAButtonProps) {
  // Detect if device is mobile
  const isMobile = typeof window !== 'undefined' 
    ? /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    : false

  // Select appropriate URL: mobile URL if provided and device is mobile, otherwise desktop URL
  const url = isMobile && ctaMobileUrl ? ctaMobileUrl : ctaUrl

  // Get translated text based on language
  const getTranslatedText = () => {
    switch (language) {
      case 'fr':
        return ctaTextFr || ctaText || 'Learn More'
      case 'de':
        return ctaTextDe || ctaText || 'Learn More'
      default:
        return ctaText || 'Learn More'
    }
  }

  const buttonText = getTranslatedText()

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={embedMode 
        ? "w-full inline-block text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2.5 px-5 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
        : "w-full inline-block text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
      }
    >
      {buttonText}
    </a>
  )
}
