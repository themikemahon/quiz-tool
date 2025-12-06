export type QuizStatus = 'draft' | 'published';

export type TemplateType = 'scam-detector' | 'custom';

export interface Quiz {
  id: number;
  title: string;
  description?: string;
  intro_text?: string;
  status: QuizStatus;
  template_type: TemplateType;
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
  image_url?: string;
  question_text: string;
  correct_answer: string;
  explanation?: string;
  created_at: string;
}

export interface AnswerOption {
  id: number;
  question_id: number;
  option_text: string;
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
