# Job Scrapper Web

Job Scrapper Web is a modern Next.js dashboard application designed to track, manage, and optimize job applications scraped using the companion backend [Job Scraper](https://github.com/anandanair/job-scraper). 

It allows users to review scraped job listings, mark application statuses, evaluate suitability using AI resume match scores, generate tailored resumes on-demand, and preview ATS-compliant PDFs directly in the browser.

---

## Features

- **High-Performance Dashboard**: Instant overview with aggregate metrics (new jobs, applied jobs, top matches, daily applications) powered by an optimized PostgreSQL RPC function (`get_dashboard_stats`) and server-side tag caching.
- **Job Listings & Pipeline Tracking**:
  - **New Jobs**: Browse freshly scraped job opportunities from LinkedIn and CareersFuture.
  - **Top Matches**: Filter and sort jobs exceeding target score thresholds.
  - **Applied Jobs**: Track status progression across stages (`applied`, `interviewing`, `offer`, `rejected`).
- **In-App AI Resume Customization (On-Demand)**:
  - Generate a tailored ATS-friendly resume for any job with a single click.
  - Automatically personalizes the professional summary and experience bullet points using AI (Fireworks AI / Gemini / OpenAI).
  - Compiles the PDF using PDFKit, uploads it to private Supabase Storage (`personalized_resumes`), and records it in the database.
- **Smart AI Rescoring**:
  - Rescore jobs against your customized resume on demand.
  - **Single-Rescore Protection**: Once a job has been rescored with its tailored resume, further duplicate rescoring is automatically disabled.
- **Prominent Score Indicators**:
  - Clear visual distinction between `✨ Tailored Resume Score` (emerald badge) and `📄 Base Resume Score` (blue badge) across cards, preview panes, and details views.
- **Multi-Page Custom Resume Visibility**:
  - Custom resume badges (`Custom Resume`) and direct "View Customized Resume" links appear on both the **Matches** and **New Jobs** pages.
- **Built-in PDF Viewer**:
  - View, download, and review generated custom resumes directly in-app using signed Supabase Storage URLs.
- **Interactive Markdown Viewer**: Full markdown rendering for complex job descriptions with requirements, responsibilities, and company details.

---

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (v16 with Turbopack & App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components & Icons**: [Lucide React](https://lucide.dev/)
- **PDF Generation & Viewing**: [PDFKit](https://pdfkit.org/) (server-side generation) & [React PDF](https://github.com/wojtekmaj/react-pdf) (browser viewer)
- **AI / LLM Integration**: Universal LLM client supporting [Fireworks AI](https://fireworks.ai/), [Google Gemini](https://ai.google.dev/), and OpenAI-compatible endpoints
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL, Storage, RPC functions, and Auth)

---

## Getting Started

### Prerequisites

1. **Node.js**: v20 or later.
2. **Backend Setup (Crucial)**:
   - This web dashboard shares its database with the [Job Scraper Backend](https://github.com/anandanair/job-scraper).
   - Ensure you have executed the complete [`supabase_setup/init.sql`](https://github.com/anandanair/job-scraper/blob/main/supabase_setup/init.sql) script in your **Supabase SQL Editor**. This creates all tables, indexes, storage buckets (`resumes`, `personalized_resumes`), and required RPC functions (such as `get_dashboard_stats` and `get_top_scored_jobs_custom_sort`).

---

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/anandanair/jobs-scrapper-web.git
   cd jobs-scrapper-web
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**

   Create a `.env.local` file in the project root:

   ```env
   # --- Supabase Configuration ---
   NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...   # Your Publishable (anon) key
   SUPABASE_SERVICE_ROLE_KEY=sb_secret_...            # Your Secret (service role) key

   # --- AI Configuration (Required for In-App Resume Tailoring & Rescoring) ---
   # Provide your Fireworks AI key OR Google Gemini API key:
   LLM_API_KEY=AIzaSy...                              # Or Fireworks API key (fw_...)
   FIREWORKS_API_KEY=fw_...                           # Optional: explicitly set Fireworks key
   LLM_MODEL=accounts/fireworks/models/glm-5p3-flash  # Optional: model to use (default: glm-5p3-flash)
   ```

   > [!NOTE]
   > **Supabase Key Renaming:**
   > - `NEXT_PUBLIC_SUPABASE_ANON_KEY` is your **Publishable key** (`sb_publishable_...` or legacy anon JWT).
   > - `SUPABASE_SERVICE_ROLE_KEY` is your **Secret key** (`sb_secret_...` or legacy service_role JWT). Keep this private!

---

### Running Locally

```bash
# Start the Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port specified in terminal) in your browser.

---

## Available Scripts

- `npm run dev`: Starts the development server with Turbopack.
- `npm run build`: Generates the optimized production build with type checking.
- `npm run start`: Runs the production server after building.
- `npm run lint`: Runs ESLint checks.

---

## Project Structure

```
.
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── base-resume/               # Base resume retrieval API
│   │   │   ├── customized_resumes/        # Customized resume queries & signed URLs
│   │   │   ├── generate-resume/           # PDFKit resume generator endpoint
│   │   │   ├── jobs/
│   │   │   │   └── [job_id]/
│   │   │   │       ├── customize-resume/  # On-demand AI resume tailor + auto-rescore
│   │   │   │       └── rescore/           # On-demand AI job rescoring
│   │   │   └── revalidate-stats/          # Cache revalidation route for dashboard stats
│   │   ├── jobs/
│   │   │   ├── applied/                   # Applied jobs tracking page
│   │   │   ├── new/                       # Recently scraped jobs page
│   │   │   ├── top-matches/               # High-scoring matched jobs page
│   │   │   └── [job_id]/                  # Job details view & resume viewer/editor
│   │   ├── layout.tsx                     # Global layout & header navigation
│   │   └── page.tsx                       # Homepage dashboard with cached RPC metrics
│   ├── components/
│   │   ├── jobs/
│   │   │   ├── AppliedJobsList.tsx        # Pipeline management table
│   │   │   ├── JobDetailsClient.tsx       # Detailed job view with score badges & actions
│   │   │   ├── PaginationControls.tsx     # Reusable pagination
│   │   │   └── TopMatchesList.tsx         # Split-pane list & preview for New & Matched jobs
│   │   ├── CustomPdfViewer.tsx            # PDF viewing component
│   │   └── Navbar.tsx                     # Top navigation bar
│   ├── lib/
│   │   ├── llm.ts                         # Universal LLM client (Fireworks AI & Gemini)
│   │   ├── pdf.ts                         # PDFKit ATS resume document builder
│   │   └── supabase/
│   │       ├── queries.ts                 # Database query helpers & RPC wrappers
│   │       └── storage.ts                 # Supabase Storage signed URL utilities
│   └── types.ts                           # TypeScript interfaces (Job, Resume, Experience, etc.)
├── .env.local                             # Local environment variables (git-ignored)
└── package.json
```

---

## Contributing

Contributions and feature suggestions are welcome! Feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
