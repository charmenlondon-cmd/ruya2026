export type SessionState =
  | 'idle'
  | 'language_select'
  | 'avatar_select'
  | 'name_entry'
  | 'track_select'
  | 'question_active'
  | 'answer_submitted'
  | 'question_result'
  | 'final_result'
  | 'screensaver'

export type Language = 'en' | 'ar'

export type CorrectAnswer = 'A' | 'B' | 'C'

export type Track =
  | 'Engineering'
  | 'Finance'
  | 'Architecture & Design'
  | 'Human Resources'
  | 'IT'
  | 'Legal & Compliance'
  | 'Marketing'
  | 'Operations & Supply Chain'
  | 'Project Management'
  | 'Sales & Business Development'

export type Session = {
  id: string
  lane: string
  state: SessionState
  language: Language | null
  player_name: string | null
  avatar_id: string | null
  track: Track | null
  current_question: number
  score: number
  last_answer: CorrectAnswer | null
  last_answer_correct: boolean | null
  created_at: string
  updated_at: string
}

export type Question = {
  id: string
  track: string
  question_no: number
  language: Language
  question_text: string
  answer_a_text: string | null
  answer_a_image_url: string | null
  answer_b_text: string | null
  answer_b_image_url: string | null
  answer_c_text: string | null
  answer_c_image_url: string | null
  correct_answer: CorrectAnswer
  created_at: string
}

export type Hire = {
  id: string
  session_id: string | null
  player_name: string
  avatar_id: string
  track: Track
  score: number
  hired_at: string
}

export interface Database {
  public: {
    Tables: {
      sessions: {
        Row: Session
        Insert: Omit<Session, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Session, 'id' | 'created_at' | 'updated_at'>>
        Relationships: never[]
      }
      questions: {
        Row: Question
        Insert: Omit<Question, 'id' | 'created_at'>
        Update: Partial<Omit<Question, 'id' | 'created_at'>>
        Relationships: never[]
      }
      hires: {
        Row: Hire
        Insert: Omit<Hire, 'id' | 'hired_at'>
        Update: Partial<Omit<Hire, 'id' | 'hired_at'>>
        Relationships: never[]
      }
    }
    Views: Record<string, {
      Row: Record<string, unknown>
      Relationships: []
    }>
    Functions: Record<string, {
      Args: Record<string, unknown>
      Returns: unknown
    }>
  }
}
