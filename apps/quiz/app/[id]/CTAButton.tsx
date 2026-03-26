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
        ? "w-full btn-primary-sm text-center"
        : "w-full btn-primary text-center"
      }
    >
      {buttonText}
    </a>
  )
}
