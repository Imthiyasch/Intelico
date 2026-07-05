# Intellico — ATS Resume Builder SaaS

Intellico is a full-stack Next.js application that leverages AI to help users build ATS-optimized resumes in minutes.

## Features
- **AI-Powered Optimization**: Uses OpenAI GPT-4o-mini to rewrite resumes with strong action verbs, ATS keywords, and quantifiable achievements.
- **CV Upload & Parse**: Users can upload existing PDF or DOCX resumes. The backend extracts the text and uses AI to auto-fill the builder form.
- **5 Professional Templates**: ATS-safe templates (Classic, Modern, Minimal, Bold, Executive) designed to pass software filters and impress recruiters.
- **PDF & Word Export**: Download pixel-perfect PDFs or editable Word (.docx) documents.
- **Authentication**: Secure email/password login powered by Supabase.
- **Subscriptions**: Razorpay integration for Free, Pro, and Premium tiers.

## Tech Stack
- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Lucide Icons
- **Backend**: Next.js API Routes (Serverless)
- **Database & Auth**: Supabase (PostgreSQL)
- **AI Integration**: OpenAI API (gpt-4o-mini)
- **Payments**: Razorpay Subscriptions API
- **File Processing**: `pdf-parse`, `mammoth` (for DOCX extraction), `docx` (for Word generation), `html2canvas` + `jsPDF` (for PDF generation)

## Environment Variables
Create a `.env.local` file in the root directory:

```env
# Supabase (Get these from your project dashboard)
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=sk-your-openai-key

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Setup & Run Locally

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   - Create a new project on [Supabase](https://supabase.com).
   - Go to the SQL Editor and run the SQL provided in `supabase/schema.sql`.
   - Copy your API keys into `.env.local`.

3. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

## Deployment to Vercel
This project is configured and ready for Vercel deployment (Free tier).

1. Push your code to a GitHub repository.
2. Import the project in Vercel.
3. Add all the environment variables from your `.env.local` file to the Vercel project settings.
4. Deploy! (The `vercel.json` file is already included to handle API function timeouts).
