# PRD.MD - Clevio Coder Camp PPT Generator

## Overview
Platform web berbasis AI untuk menghasilkan presentasi pembelajaran coding secara otomatis untuk Clevio Coder Camp. Sistem ini mengintegrasikan AI research untuk menghasilkan konten berkualitas tinggi dan menggunakan template desain yang konsisten.

## Goals
- Mempercepat pembuatan materi pembelajaran untuk instruktur
- Menghasilkan konten PPT yang terstruktur dan berkualitas melalui AI research
- Menyediakan preview dan download PPT dengan desain template standar Clevio Coder Camp

## User Stories
1. Sebagai instruktur, saya ingin menginput topik pembelajaran (contoh: "Membuat Game Flappy Bird dengan Unity") dan mendapatkan PPT lengkap dengan outline dan konten yang terstruktur
2. Sebagai instruktur, saya ingin melihat preview PPT sebelum mendownload
3. Sebagai instruktur, saya ingin mendownload PPT dalam format .pptx untuk diedit lebih lanjut

## Technical Architecture

### Frontend (React)
- **Framework**: React dengan TypeScript
- **Styling**: Tailwind CSS
- **Libraries**:
  - `pptxgenjs` - untuk generate PowerPoint files
  - `axios` - untuk API calls
  - `react-router-dom` - untuk routing
  - PPT preview component (custom atau library seperti `react-pptx-preview`)

### Backend Integration
- **n8n Webhook**: Endpoint untuk trigger AI research workflow
- **API Communication**: REST API untuk kirim/terima data dari n8n

### AI Research Workflow (n8n)
- Input: Topic description dari user
- Process: Deep research menggunakan AI (Claude/GPT)
- Output: JSON structure berisi outline dan konten slides

## Features & Requirements

### 1. Input Form
**UI Components:**
- Text input untuk judul lesson
- Textarea untuk deskripsi detail topik
- Dropdown untuk kategori (Game Development, Web Development, Mobile App Development)
- Dropdown untuk level (Beginner, Intermediate, Advanced)
- Input untuk jumlah slides yang diinginkan (default: 10-15)
- Button "Generate PPT"

**Validation:**
- Judul wajib diisi (min 5 karakter)
- Deskripsi wajib diisi (min 20 karakter)
- Kategori dan level wajib dipilih

### 2. AI Research Integration

**Request to n8n Webhook:**
```json
{
  "title": "Membuat Game Flappy Bird dengan Unity",
  "description": "Pembelajaran step-by-step membuat game flappy bird untuk pemula",
  "category": "Game Development",
  "level": "Beginner",
  "targetSlides": 12,
  "timestamp": "2025-11-20T10:30:00Z"
}
```

**Expected Response from n8n:**
```json
{
  "status": "success",
  "data": {
    "title": "Membuat Game Flappy Bird dengan Unity",
    "subtitle": "Panduan Lengkap untuk Pemula",
    "outline": [
      {
        "slideNumber": 1,
        "title": "Pengenalan Game Flappy Bird",
        "content": [
          "Apa itu Flappy Bird?",
          "Kenapa belajar dengan Flappy Bird?",
          "Game mechanics yang akan dipelajari"
        ],
        "notes": "Jelaskan konsep dasar game dan motivasi pembelajaran"
      },
      {
        "slideNumber": 2,
        "title": "Setup Unity Project",
        "content": [
          "Install Unity Hub",
          "Membuat project 2D baru",
          "Struktur folder project"
        ],
        "notes": "Demo instalasi dan setup project",
        "codeSnippet": null
      },
      {
        "slideNumber": 3,
        "title": "Membuat Player (Bird)",
        "content": [
          "Import sprite bird",
          "Menambahkan Rigidbody2D",
          "Script untuk kontrol jump"
        ],
        "notes": "Hands-on session membuat karakter bird",
        "codeSnippet": {
          "language": "csharp",
          "code": "using UnityEngine;\n\npublic class BirdController : MonoBehaviour\n{\n    public float jumpForce = 5f;\n    private Rigidbody2D rb;\n\n    void Start()\n    {\n        rb = GetComponent<Rigidbody2D>();\n    }\n\n    void Update()\n    {\n        if (Input.GetMouseButtonDown(0))\n        {\n            rb.velocity = Vector2.up * jumpForce;\n        }\n    }\n}"
        }
      }
    ],
    "metadata": {
      "totalSlides": 12,
      "estimatedDuration": "90 minutes",
      "prerequisites": ["Basic C# knowledge", "Unity installed"],
      "learningOutcomes": [
        "Mampu membuat game 2D sederhana",
        "Memahami physics dalam Unity",
        "Memahami game loop dan input handling"
      ]
    }
  }
}
```

**Loading States:**
- Show progress indicator saat request ke n8n
- Estimasi waktu: "Generating content... (30-60 seconds)"
- Disable form saat sedang processing

### 3. PPT Generation

**Template Design Requirements:**
- **Master Slide**: 
  - Logo Clevio Coder Camp di top-right
  - Footer dengan page number dan copyright
  - Color scheme: Primary (#FF6B35), Secondary (#004E89), Accent (#F7B801)
  
- **Title Slide**:
  - Large title text (44pt, bold)
  - Subtitle (24pt)
  - Clevio Coder Camp logo (center-large)
  - Background gradient

- **Content Slide**:
  - Slide title (32pt, bold)
  - Bullet points (20pt)
  - Support untuk code snippets dengan syntax highlighting
  - Image placeholder areas

- **Section Header Slide**:
  - Large section title
  - Decorative element
  - Background berbeda dari content slide

**PPT Structure:**
1. Title slide
2. Agenda/Overview slide (from outline)
3. Content slides (from AI data)
4. Summary/Key Takeaways slide
5. Q&A slide
6. Thank You slide dengan contact info

**Code Snippet Formatting:**
- Font: Consolas atau monospace
- Background: Light gray (#F5F5F5)
- Syntax highlighting jika memungkinkan
- Font size: 14-16pt

### 4. Preview Component

**Features:**
- Slide navigation (previous/next buttons)
- Slide thumbnail sidebar
- Fullscreen mode
- Slide counter (e.g., "Slide 3 of 12")

**UI/UX:**
- Responsive design
- Smooth transitions between slides
- Keyboard navigation (arrow keys)

### 5. Download Functionality

**Format**: .pptx (PowerPoint)
**Filename**: `clevio-coder-camp-[topic-slug]-[timestamp].pptx`
**Example**: `clevio-coder-camp-flappy-bird-unity-20251120.pptx`

**Download Options:**
- Direct download button
- Option untuk download dengan/tanpa notes

### 6. Error Handling

**Scenarios:**
- n8n webhook timeout (> 90 seconds)
- n8n returns error
- Invalid response format
- Network errors

**Error Messages:**
- User-friendly error messages dalam Bahasa Indonesia
- Retry button
- Option untuk "Save draft" jika partially successful

### 7. Additional Features (Nice to Have)

- **History**: Simpan generated PPTs di localStorage
- **Edit Mode**: Allow minor edits sebelum download
- **Templates**: Multiple template options
- **Export Options**: PDF export selain PPTX
- **Collaboration**: Share link untuk preview

## Data Models

### Frontend State
```typescript
interface LessonInput {
  title: string;
  description: string;
  category: 'Game Development' | 'Web Development' | 'Mobile App Development';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  targetSlides: number;
}

interface Slide {
  slideNumber: number;
  title: string;
  content: string[];
  notes?: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  imageUrl?: string;
}

interface PresentationData {
  title: string;
  subtitle: string;
  outline: Slide[];
  metadata: {
    totalSlides: number;
    estimatedDuration: string;
    prerequisites: string[];
    learningOutcomes: string[];
  };
}
```

## n8n Workflow Design

**Nodes Required:**
1. **Webhook Trigger**: Receive POST request
2. **AI Research Node** (HTTP Request to Claude/OpenAI):
   - Prompt engineering untuk generate outline
   - Deep research tentang topik
   - Structured output format
3. **Content Generator Node**:
   - Generate detail content per slide
   - Generate code examples
   - Generate learning notes
4. **Response Formatter**: Format to expected JSON structure
5. **Webhook Response**: Return data to frontend

**Prompt Template for AI (in n8n):**
```
You are an expert coding instructor for Clevio Coder Camp. Create a comprehensive lesson presentation about: {topic}

Category: {category}
Level: {level}
Target Slides: {targetSlides}

Generate a structured outline with:
1. Clear learning objectives
2. Step-by-step content breakdown
3. Code examples with explanations
4. Practical tips and best practices
5. Common pitfalls to avoid

Format the response as JSON with the following structure:
- title, subtitle, outline (array of slides)
- Each slide should have: slideNumber, title, content (array), notes, codeSnippet (if applicable)
- Include metadata: prerequisites, learning outcomes, estimated duration

Make it engaging, practical, and suitable for {level} level students.
```

## API Endpoints

### POST /api/generate-ppt
**Request:**
```json
{
  "title": "string",
  "description": "string",
  "category": "string",
  "level": "string",
  "targetSlides": number
}
```

**Response (Success):**
```json
{
  "status": "success",
  "data": PresentationData,
  "generatedAt": "timestamp"
}
```

**Response (Error):**
```json
{
  "status": "error",
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

## Environment Variables

```env
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/generate-ppt
VITE_API_TIMEOUT=90000
VITE_APP_NAME=Clevio Coder Camp PPT Generator
```

## File Structure

```
clevio-ppt-generator/
├── src/
│   ├── components/
│   │   ├── InputForm.tsx
│   │   ├── PPTPreview.tsx
│   │   ├── SlideNavigator.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorMessage.tsx
│   ├── services/
│   │   ├── api.ts
│   │   ├── pptGenerator.ts
│   │   └── templateConfig.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── validators.ts
│   │   └── formatters.ts
│   ├── assets/
│   │   ├── logo.png
│   │   └── templates/
│   ├── App.tsx
│   └── main.tsx
├── public/
├── package.json
├── tsconfig.json
└── README.md
```

## Testing Requirements

### Unit Tests
- Input validation
- API request/response handling
- PPT generation logic

### Integration Tests
- End-to-end flow dari input sampai download
- n8n webhook integration
- Error scenarios

### Manual Testing Checklist
- [ ] Generate PPT untuk setiap kategori
- [ ] Test dengan berbagai input lengths
- [ ] Test error handling (network offline, timeout)
- [ ] Test di berbagai browsers (Chrome, Firefox, Safari)
- [ ] Test responsiveness (mobile, tablet, desktop)
- [ ] Download dan buka file .pptx di PowerPoint/Google Slides
- [ ] Verify template design consistency

## Performance Requirements
- Initial load: < 3 seconds
- API response time: < 60 seconds (AI processing)
- PPT generation: < 5 seconds
- Preview rendering: < 2 seconds
- Smooth animations (60fps)

## Security Considerations
- Sanitize user inputs
- Rate limiting untuk prevent abuse
- CORS configuration untuk n8n webhook
- No sensitive data in client-side code
- Validate n8n response structure

## Deployment
- **Hosting**: Vercel / Netlify
- **n8n**: Self-hosted atau n8n Cloud
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry untuk error tracking

## Success Metrics
- Average generation time < 60 seconds
- Success rate > 95%
- User satisfaction (feedback form)
- Number of PPTs generated per week

## Future Enhancements
- Multi-language support (English, Indonesia)
- Custom branding per camp/program
- Integration dengan LMS
- Collaborative editing
- Video embed support
- Interactive elements dalam PPT
- AI-powered image generation untuk slides
- Voice-over generation

## Timeline Estimate
- Week 1: Setup project, basic UI, input form
- Week 2: n8n workflow, AI integration, API connection
- Week 3: PPT generation dengan template
- Week 4: Preview component, download functionality
- Week 5: Testing, bug fixes, polish
- Week 6: Deployment, documentation

---

**Version**: 1.0  
**Last Updated**: November 20, 2025  
**Author**: Product Team - Clevio Coder Camp