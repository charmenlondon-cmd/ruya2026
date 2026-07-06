import { createClient } from '@supabase/supabase-js'
import { parse } from 'csv-parse/sync'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load .env.local (not .env) for SUPABASE_SERVICE_ROLE_KEY
dotenv.config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

// Track name normalization map
const TRACK_MAP: Record<string, string> = {
  'Engineering': 'Engineering',
  'ENGINEERING': 'Engineering',
  'IT': 'IT',
  'FINANCE': 'Finance',
  'ARCHITECTURE & DESIGN': 'Architecture & Design',
  'HUMAN RESOURCES': 'Human Resources',
  'LEGAL & COMPLIANCE': 'Legal & Compliance',
  'MARKETING': 'Marketing',
  'OPERATIONS & SUPPLY CHAIN': 'Operations & Supply Chain',
  'PROJECT MANAGEMENT': 'Project Management',
  'SALES & BUSINESS DEVELOPMENT': 'Sales & Business Development',
}

function isImagePath(value: string): boolean {
  return value.startsWith('C:\\') || value.startsWith('C:/')
}

async function uploadImage(absolutePath: string): Promise<string> {
  // Normalize backslashes to forward slashes for cross-platform path handling
  const normalizedAbsolute = absolutePath.replace(/\\/g, '/')
  const fileName = path.basename(normalizedAbsolute)
  const fileBuffer = fs.readFileSync(normalizedAbsolute)
  const contentType = fileName.endsWith('.jpg') ? 'image/jpeg' : 'image/png'

  const { error } = await supabase.storage
    .from('question-images')
    .upload(fileName, fileBuffer, { contentType, upsert: true })

  if (error) throw new Error(`Storage upload failed for ${fileName}: ${error.message}`)

  const { data } = supabase.storage.from('question-images').getPublicUrl(fileName)
  return data.publicUrl
}

type QuestionInsert = {
  track: string
  question_no: number
  language: 'en' | 'ar'
  question_text: string
  answer_a_text: string | null
  answer_a_image_url: string | null
  answer_b_text: string | null
  answer_b_image_url: string | null
  answer_c_text: string | null
  answer_c_image_url: string | null
  correct_answer: 'A' | 'B' | 'C'
}

async function main() {
  console.log('Starting question seed...')

  // Ensure storage bucket exists
  const { error: bucketError } = await supabase.storage.createBucket('question-images', { public: true })
  if (bucketError) {
    if (bucketError.message.includes('already exists') || (bucketError as { statusCode?: string }).statusCode === '23505') {
      console.log('Storage bucket "question-images" already exists — continuing.')
    } else {
      throw new Error(`Failed to create storage bucket: ${bucketError.message}`)
    }
  } else {
    console.log('Storage bucket "question-images" created.')
  }

  // Read and parse CSV
  const csvPath = path.resolve('Question Matrix.csv')
  const rawBuffer = fs.readFileSync(csvPath)

  // Strip UTF-8 BOM if present (EF BB BF)
  let csvContent: string
  if (rawBuffer[0] === 0xEF && rawBuffer[1] === 0xBB && rawBuffer[2] === 0xBF) {
    csvContent = rawBuffer.slice(3).toString('utf-8')
  } else {
    csvContent = rawBuffer.toString('utf-8')
  }

  const rows = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as Array<{
    Track: string
    Question_no: string
    Question: string
    Answer_A: string
    Answer_B: string
    Answer_C: string
    'Correct Answer': string
  }>

  console.log(`Parsed ${rows.length} rows from CSV.`)

  // Clear existing questions
  console.log('Clearing existing questions...')
  const { error: deleteError } = await supabase
    .from('questions')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')
  if (deleteError) throw new Error(`Failed to delete existing questions: ${deleteError.message}`)
  console.log('Existing questions cleared.')

  // Cache for uploaded image URLs (avoid re-uploading same file)
  const imageUrlCache = new Map<string, string>()

  async function resolveAnswer(value: string): Promise<{ text: string | null; image_url: string | null }> {
    if (!value || value.trim() === '') {
      return { text: null, image_url: null }
    }
    if (isImagePath(value)) {
      const normalizedPath = value.replace(/\\/g, '/')
      if (!imageUrlCache.has(normalizedPath)) {
        console.log(`  Uploading image: ${path.basename(normalizedPath)}`)
        const url = await uploadImage(value)
        imageUrlCache.set(normalizedPath, url)
      }
      return { text: null, image_url: imageUrlCache.get(normalizedPath)! }
    }
    return { text: value.trim(), image_url: null }
  }

  // Build inserts
  const inserts: QuestionInsert[] = []

  for (const row of rows) {
    const originalTrack = row.Track.trim()

    // Detect language
    const isArabic = originalTrack.endsWith(' (AR)')
    const language: 'en' | 'ar' = isArabic ? 'ar' : 'en'

    // Strip " (AR)" suffix for normalization
    const trackKey = isArabic ? originalTrack.slice(0, -5).trim() : originalTrack

    const normalizedTrack = TRACK_MAP[trackKey]
    if (!normalizedTrack) {
      console.warn(`  Unknown track: "${trackKey}" (original: "${originalTrack}") — skipping row.`)
      continue
    }

    const answerA = await resolveAnswer(row.Answer_A)
    const answerB = await resolveAnswer(row.Answer_B)
    const answerC = await resolveAnswer(row.Answer_C)

    const correctAnswer = (row['Correct Answer'] || '').trim().toUpperCase() as 'A' | 'B' | 'C'
    if (!['A', 'B', 'C'].includes(correctAnswer)) {
      console.warn(`  Invalid correct answer "${correctAnswer}" for ${normalizedTrack} Q${row.Question_no} — skipping.`)
      continue
    }

    inserts.push({
      track: normalizedTrack,
      question_no: parseInt(row.Question_no, 10),
      language,
      question_text: row.Question.trim(),
      answer_a_text: answerA.text,
      answer_a_image_url: answerA.image_url,
      answer_b_text: answerB.text,
      answer_b_image_url: answerB.image_url,
      answer_c_text: answerC.text,
      answer_c_image_url: answerC.image_url,
      correct_answer: correctAnswer,
    })
  }

  console.log(`Built ${inserts.length} question inserts. Starting batch insert...`)

  // Batch insert in chunks of 50
  const CHUNK_SIZE = 50
  let inserted = 0
  for (let i = 0; i < inserts.length; i += CHUNK_SIZE) {
    const chunk = inserts.slice(i, i + CHUNK_SIZE)
    const { error: insertError } = await supabase.from('questions').insert(chunk)
    if (insertError) throw new Error(`Batch insert failed at offset ${i}: ${insertError.message}`)
    inserted += chunk.length
    console.log(`  Inserted rows ${i + 1}–${inserted}`)
  }

  // Print summary by track and language
  const summary: Record<string, { en: number; ar: number }> = {}
  for (const q of inserts) {
    if (!summary[q.track]) summary[q.track] = { en: 0, ar: 0 }
    summary[q.track][q.language]++
  }

  console.log('\nSummary by track:')
  for (const [track, counts] of Object.entries(summary)) {
    console.log(`  ${track}: ${counts.en} EN + ${counts.ar} AR = ${counts.en + counts.ar} rows`)
  }

  console.log(`\nTotal: ${inserted} rows inserted.`)
  console.log(`Images uploaded: ${imageUrlCache.size} unique images.`)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
