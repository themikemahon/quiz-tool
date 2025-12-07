// Static UI translations for the quiz player
export type Language = 'en' | 'fr' | 'de'

export interface UITranslations {
  startQuiz: string
  question: string
  of: string
  scam: string
  notScam: string
  correct: string
  incorrect: string
  nextQuestion: string
  seeResults: string
  quizComplete: string
  youScored: string
  takeQuizAgain: string
  backToHome: string
}

export const translations: Record<Language, UITranslations> = {
  en: {
    startQuiz: 'Start Quiz',
    question: 'Question',
    of: 'of',
    scam: 'Scam',
    notScam: 'Not a Scam',
    correct: 'Correct!',
    incorrect: 'Incorrect',
    nextQuestion: 'Next Question',
    seeResults: 'See Results',
    quizComplete: 'Quiz Complete!',
    youScored: 'You scored',
    takeQuizAgain: 'Take Quiz Again',
    backToHome: 'Back to Home',
  },
  fr: {
    startQuiz: 'Commencer le Quiz',
    question: 'Question',
    of: 'sur',
    scam: 'Arnaque',
    notScam: 'Pas une Arnaque',
    correct: 'Correct !',
    incorrect: 'Incorrect',
    nextQuestion: 'Question Suivante',
    seeResults: 'Voir les Résultats',
    quizComplete: 'Quiz Terminé !',
    youScored: 'Vous avez obtenu',
    takeQuizAgain: 'Refaire le Quiz',
    backToHome: 'Retour à l\'Accueil',
  },
  de: {
    startQuiz: 'Quiz Starten',
    question: 'Frage',
    of: 'von',
    scam: 'Betrug',
    notScam: 'Kein Betrug',
    correct: 'Richtig!',
    incorrect: 'Falsch',
    nextQuestion: 'Nächste Frage',
    seeResults: 'Ergebnisse Anzeigen',
    quizComplete: 'Quiz Abgeschlossen!',
    youScored: 'Sie haben erzielt',
    takeQuizAgain: 'Quiz Wiederholen',
    backToHome: 'Zurück zur Startseite',
  },
}

export function getTranslations(lang?: string): UITranslations {
  const language = (lang || 'en') as Language
  return translations[language] || translations.en
}
