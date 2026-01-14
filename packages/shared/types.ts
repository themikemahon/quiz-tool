export type QuizStatus = 'draft' | 'published';

export type TemplateType = 'scam-detector' | 'custom';

export type QuestionType = 'scam-detector' | 'multiple-choice' | 'comparison' | 'true-false';

export interface BrandTheme {
  id: number;
  name: 'default' | 'avast' | 'norton' | 'lifelock' | 'gen';
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  text_color: string;
  background_color: string;
  font_family: string;
  font_url?: string;
}

export interface Quiz {
  id: number;
  title: string;
  description?: string;
  intro_text?: string;
  status: QuizStatus;
  template_type: TemplateType;
  brand_theme_id?: number;
  cta_enabled: boolean;
  cta_text?: string;
  cta_text_fr?: string;
  cta_text_de?: string;
  cta_url?: string;
  cta_mobile_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ResultTier {
  id: number;
  quiz_id: number;
  tier_name: string;
  min_percentage: number;
  max_percentage: number;
  message: string;
  order_index: number;
}

export interface Question {
  id: number;
  quiz_id: number;
  order_index: number;
  question_type: QuestionType;
  image_url?: string;
  image_url_2?: string;
  question_text: string;
  correct_answer: string;
  explanation?: string;
  created_at: string;
}

export interface AnswerOption {
  id: number;
  question_id: number;
  option_text: string;
  option_text_fr?: string;
  option_text_de?: string;
  is_correct: boolean;
  order_index: number;
}

export interface QuizWithQuestions extends Quiz {
  questions: (Question & { options?: AnswerOption[] })[];
}

export interface QuizResponse {
  question_id: number;
  selected_answer: string;
  is_correct: boolean;
}

export interface QuizResult {
  total_questions: number;
  correct_answers: number;
  score_percentage: number;
  responses: QuizResponse[];
}

// Type guards for question types
export function isScamDetector(question: Question): boolean {
  return question.question_type === 'scam-detector';
}

export function isMultipleChoice(question: Question): boolean {
  return question.question_type === 'multiple-choice';
}

export function isComparison(question: Question): boolean {
  return question.question_type === 'comparison';
}

export function isTrueFalse(question: Question): boolean {
  return question.question_type === 'true-false';
}
