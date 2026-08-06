Absolutely — here’s a strong starter prompt you can paste into Claude Code / Codex CLI.

Build a production-ready interactive careers fair web app using Next.js, React, TypeScript, Tailwind CSS, Supabase, and Vercel deployment compatibility.

The app is for an Emirati careers fair. It is a two-screen game where an iPad acts as the player controller and a large screen acts as the main game display.

Core concept:
Players test whether they could be hired into one of our Group’s career tracks. They select a language, avatar, name, and career track, then answer 10 questions. The main screen shows the question and answer options, while the iPad only shows A/B/C answer buttons. At the end, the player receives a result of either “You’re Hired” or “We’ll Get Back to You”. If hired, their avatar is added to a growing animated “new hires” network clustered by career track around a central Group logo.

Use this stack:

* Next.js with App Router
* TypeScript
* Tailwind CSS
* Supabase for database and realtime state sync
* Framer Motion for UI animation
* D3.js or Canvas for the animated avatar network
* Vercel-compatible project structure

Create these routes:

* `/controller` — iPad controller interface
* `/display` — large screen game display
* `/admin` — staff/admin controls
* `/` — simple landing page with links to controller, display, and admin

Game flow:

1. Language selection: English or Arabic
2. Avatar selection from 10 available avatars
3. Name entry
4. Career track selection from:

   * Engineering
   * IT
   * Finance
   * Marketing
   * Human Resources
   * Legal & Compliance
   * Operations & Supply Chain
   * Project Management
   * Sales & Business Development
   * Architecture & Design
5. Quiz starts
6. Large screen displays:

   * player name
   * selected avatar
   * selected career track
   * question number
   * question text
   * answer options A, B, C — shown as text or image depending on the question
7. iPad displays only:

   * question number
   * large A, B, C answer buttons
   * submit/next state
8. Answer is submitted
9. Score is updated
10. After 10 questions, final result is shown
11. If result is “You’re Hired”, player is saved into the hires list and appears in the animated network on the big screen

Scoring:

* 7–10: “You’re Hired”
* 0–6: “We’ll Get Back to You”

Data model:
Create Supabase-compatible table definitions or migration SQL for:

* `game_sessions`
* `players`
* `questions`
* `hires`

Suggested fields:

`game_sessions`

* id
* phase
* active_player_id
* language
* selected_track
* current_question_index
* selected_answer
* score
* created_at
* updated_at

`players`

* id
* name
* avatar_id
* language
* selected_track
* score
* result
* created_at

`questions`

* id
* track
* question_no
* question_en
* question_ar
* answer_a_en
* answer_a_ar
* answer_a_image_url (optional — if present, image is shown instead of text for option A)
* answer_b_en
* answer_b_ar
* answer_b_image_url (optional)
* answer_c_en
* answer_c_ar
* answer_c_image_url (optional)
* correct_answer
* created_at

`hires`

* id
* player_id
* name
* avatar_id
* track
* score
* created_at

Session phases:

* idle
* language_select
* avatar_select
* name_entry
* track_select
* question_active
* answer_submitted
* question_result
* final_result
* screensaver

Realtime behaviour:

* The controller updates the active game session in Supabase
* The display subscribes to Supabase realtime changes
* When the controller advances the question, the display updates immediately
* When the controller submits an answer, the display shows the selected answer and feedback
* When the game ends, the display shows the final result
* If hired, the hires table updates and the animated network refreshes

Design requirements:

* Premium corporate event look
* Big, readable typography for large screens
* Youthful and engaging enough for Emirati teenagers and young adults
* Support English and Arabic layout
* Arabic should use RTL layout
* Buttons should be large and iPad-friendly
* Use placeholder avatars and a placeholder Group logo for now
* Use clean reusable components

Admin page requirements:

* Start/reset session
* Clear current player
* Clear all hires
* Manually move session to screensaver
* View current session state
* Seed questions from the master Excel question matrix
* View, edit, and reorder questions per track via the admin UI

Questions:
All questions and answers are stored in the Supabase `questions` table and read dynamically at runtime — nothing is hardcoded. The question text, answer options (A/B/C), correct answer, order, and any associated images can be updated in Supabase (or via the admin UI) without any code changes. The initial dataset is imported from the master Excel question matrix (`Question Matrix.xlsx`).

Some questions use image-based answer options (A, B, C) instead of text. The data model supports both: each answer option has an optional image URL alongside its text fields. If an image is present for an answer option, the display shows the image instead of text.

Image files for image-based answers are organised by track and question number (e.g. `Architecture & Design - Q6 Images/A&D - Q6 - A.jpg`).

Important reliability requirements:

* Prevent double submission of answers
* Handle lost realtime connection gracefully
* Add loading and error states
* Make the app usable on iPad Safari
* Make the display page full-screen friendly
* Keep the code clean, modular, and well commented where useful

Deliverables:

1. Create the full project structure
2. Implement the main routes
3. Implement Supabase client setup
4. Provide SQL migrations/schema
5. Provide seed data for sample questions
6. Implement realtime session sync
7. Implement quiz scoring logic
8. Implement the animated hires network
9. Add clear README instructions for:

   * local development
   * Supabase setup
   * environment variables
   * Vercel deployment
   * how to run the controller and display during the event

Use sensible defaults and do not over-engineer. Prioritise a working end-to-end prototype that can be visually improved later.

Optional extra instruction to add if you want the CLI to work in phases:

Please build this in clear stages. First create a working local prototype with mocked data and local state. Then add Supabase schema and realtime sync. Then add admin controls. Then improve styling and animation. After each stage, ensure the app still runs successfully.
