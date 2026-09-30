export interface Project {
  id: number;
  title: string;
  description: string;
  fullDescription: string;
  tech: string[];
  color: string;
  featured: boolean;
  demoUrl?: string;
  codeUrl: string;
  blogSlug?: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "VideoMaxx: Agentic Video Production Pipeline",
    description: "Turns a single topic into a finished, narrated, captioned video with animated data visualizations. Zero manual editing.",
    fullDescription: "A 15-stage agentic pipeline running fully locally on Apple Silicon. Gemini 2.5 Pro handles research, scripting, and self-critique; a two-pass fact-verification agent (Gemini grounding + Tavily cross-checks, SHA-256-hashed fact sheet) hard-blocks hallucinated claims before render; CLIP ranks visual assets per sentence; five Manim animation agents generate custom visualizations in parallel; Kokoro TTS narrates, WhisperX aligns word-level timestamps, and FFmpeg renders, finishing with a YouTube Shorts cut and upload via the YouTube Data API. Every stage is deterministic and resumable.",
    tech: ["Python", "Gemini 2.5 Pro", "Manim", "WhisperX", "FFmpeg", "CLIP", "Tavily"],
    color: "bg-gradient-to-br from-accent-custom-primary/20 to-accent-custom-secondary/30",
    featured: true,
    codeUrl: "https://github.com/Rizsaurav/VideoMaxx",
    blogSlug: "videomaxx-agentic-video-pipeline",
  },
  {
    id: 2,
    title: "The Open-Weight Oligopoly",
    description: "A 20,000-model audit of the Hugging Face ecosystem: who actually holds the downloads, and whether open weights are centralizing.",
    fullDescription: "An empirical audit of the Hugging Face model hub across 20,000 models and 4,144 organizations. Downloads are extremely concentrated (Gini 0.918; the top 100 models take 48.4% of 2.84B monthly downloads), yet the ecosystem is organizationally decentralized: publisher HHI is only 375, and the top-10 organizations' share of new-model downloads fell from 78.6% in 2022 to 53.7% in 2026. A repeated cross-validation pipeline (OLS R2 0.148; random-forest AUC 0.723) shows downloads are predictable but far from deterministic. Every number is assertion-gated and reproducible from the public repo.",
    tech: ["Python", "Hugging Face API", "scikit-learn", "pandas", "matplotlib", "statsmodels"],
    color: "bg-gradient-to-br from-accent-custom-primary/20 to-accent-custom-soft/30",
    featured: true,
    codeUrl: "https://github.com/Rizsaurav/-Open-Weight-Oligopoly",
    blogSlug: "open-weight-oligopoly",
  },
  {
    id: 3,
    title: "Chess Coach: Edge AI on Cloudflare",
    description: "Play a CPU at five ELO-calibrated levels or a friend, with instant move classification and Llama 3.3 coaching.",
    fullDescription: "An AI chess coaching app where everything, frontend, API, AI inference, session storage, runs on Cloudflare. A client-side minimax engine with alpha-beta pruning and difficulty-tuned noise plays at five ELO-calibrated levels (800–1800); every move is classified locally in under a millisecond (Best / Inaccuracy / Blunder…); and on-demand analysis from Llama 3.3 70B via Workers AI delivers natural-language critiques with concept tags, eval scores, and best-move arrows. Session state lives in SQLite-backed Durable Objects.",
    tech: ["React 19", "Cloudflare Workers", "Workers AI", "Llama 3.3 70B", "Durable Objects", "chess.js"],
    color: "bg-gradient-to-br from-accent-custom-secondary/20 to-accent-custom-soft/40",
    featured: true,
    demoUrl: "https://chess-coach.rizsaurav.workers.dev/",
    codeUrl: "https://github.com/Rizsaurav/cf_ai_chess_coach",
    blogSlug: "chess-coach-edge-ai",
  },
  {
    id: 4,
    title: "Sortify: AI Document Organizer",
    description: "Auto-classifies academic files and answers questions over them with a RAG-powered chatbot.",
    fullDescription: "An AI-powered document organizer for students: it automatically classifies uploaded academic files, then lets you chat with them through a RAG-based semantic search chatbot built on PGVector and Sentence Transformers. FastAPI backend exposes REST endpoints; the React/TypeScript frontend handles uploads, browsing, and the chat interface.",
    tech: ["Python", "FastAPI", "React", "TypeScript", "PostgreSQL", "PGVector", "Sentence Transformers"],
    color: "bg-gradient-to-br from-accent-custom-soft/30 to-accent-custom-primary/20",
    featured: true,
    codeUrl: "https://github.com/Rizsaurav/Sortify",
    blogSlug: "sortify-rag-document-organizer",
  },
  {
    id: 5,
    title: "T-Flash: Voice-First AI News Briefings",
    description: "Converts real-time headlines into AI-narrated audio briefings, by topic.",
    fullDescription: "A voice-first news pipeline for people who'd rather listen than scroll: commuters, multitaskers, and accessibility-focused users. Pick a topic and T-Flash fetches live headlines (NewsAPI), summarizes them with Gemini, converts to voice with ElevenLabs, and stores the audio in Supabase for playback. Orchestrated with n8n instead of a traditional backend; ships as a Next.js web app with a Flutter mobile client.",
    tech: ["Next.js", "Flutter", "n8n", "Gemini", "ElevenLabs", "Supabase", "NewsAPI"],
    color: "bg-gradient-to-br from-accent-custom-secondary/20 to-accent-custom-primary/20",
    featured: false,
    codeUrl: "https://github.com/Rizsaurav/T-Flash",
    blogSlug: "tflash-news-to-audio",
  },
  {
    id: 6,
    title: "Soccer Highlights Generator",
    description: "Builds 10-minute highlight reels from full matches using audio excitement and computer vision.",
    fullDescription: "Full-stack system that watches a soccer match the way a human editor would: Librosa detects excitement spikes in the audio (crowd noise, commentary surges), while a BRIEF + k-Means bag-of-visual-words scene classifier scores action intensity frame by frame. Segments are stitched with context-preserving pre/post buffers so cuts feel natural, not choppy. FastAPI backend, Next.js frontend, MoviePy cutting pipeline.",
    tech: ["FastAPI", "Next.js", "OpenCV", "Librosa", "MoviePy", "scikit-learn"],
    color: "bg-gradient-to-br from-accent-custom-soft/30 to-accent-custom-secondary/20",
    featured: false,
    codeUrl: "https://github.com/Rizsaurav/Soccer-Highlights-Generator",
    blogSlug: "soccer-highlights-generator",
  },
  {
    id: 7,
    title: "Sentimental Movies: NLP Film Discovery",
    description: "Ranks movies by how audiences actually felt, not by hype or watch-time optimization.",
    fullDescription: "Most platforms rank by engagement, not enjoyment. Sentimental Movies analyzed thousands of IMDb reviews across the top 2000 films with NLTK sentiment analysis, assigning each movie a 0-1 sentiment score that captures how people felt, filtering out overhyped disappointments and surfacing hidden gems. Includes an AI movie bot serving spoiler-free summaries. FastAPI + PostgreSQL backend, React frontend.",
    tech: ["FastAPI", "React", "PostgreSQL", "NLTK", "Python"],
    color: "bg-gradient-to-br from-accent-custom-primary/20 to-accent-custom-secondary/20",
    featured: false,
    codeUrl: "https://github.com/Rizsaurav/NLP-Based-Film-Recommendation-Engine",
    blogSlug: "sentimental-movies-nlp",
  },
  {
    id: 8,
    title: "TRAC: ML Cheating Detection",
    description: "Autoencoder anomaly detection plus gaze simulation for flagging suspicious test-taking behavior.",
    fullDescription: "An ML pipeline for detecting cheating behavior: MediaPipe-based gaze tracking simulation, autoencoder anomaly detection over behavioral signals, and reinforcement-learning agents (stable-baselines3/Gymnasium) modeling gaze dynamics, with full training, evaluation, visualization, and demo tooling in PyTorch.",
    tech: ["Python", "PyTorch", "MediaPipe", "stable-baselines3", "scikit-learn", "OpenCV"],
    color: "bg-gradient-to-br from-accent-custom-secondary/20 to-accent-custom-soft/30",
    featured: false,
    codeUrl: "https://github.com/Rizsaurav/TRAC",
    blogSlug: "trac-cheating-detection",
  },
  {
    id: 9,
    title: "PetTalks: Pet Owners' Forum",
    description: "A community forum where pet owners post, comment, upvote, and share photos of their pets.",
    fullDescription: "A React forum backed by a cloud-hosted SQL database: create and edit posts with images, comment and upvote, tag discussions, search by title, and sort by recency or upvotes, with pseudo-authentication and a smooth browsing experience.",
    tech: ["React", "SQL", "JavaScript", "CSS"],
    color: "bg-gradient-to-br from-accent-custom-soft/20 to-accent-custom-primary/30",
    featured: false,
    codeUrl: "https://github.com/Rizsaurav/PetTalks-Pet-Owners-Discussion-Forum",
    blogSlug: "pettalks-forum",
  },
  {
    id: 10,
    title: "Brewery Explorer",
    description: "A fast, searchable brewery explorer with interactive charts and shareable detail pages.",
    fullDescription: "A responsive React app over the Open Brewery DB API: live search and filtering across thousands of breweries, interactive charts, and dynamic routing so every brewery gets its own shareable URL. A frontend exercise in state management, data fetching, and keeping a big list feeling instant.",
    tech: ["React", "JavaScript", "REST API", "Charts"],
    color: "bg-gradient-to-br from-accent-custom-primary/30 to-accent-custom-secondary/20",
    featured: false,
    codeUrl: "https://github.com/Rizsaurav/Dashboard-Part02",
    blogSlug: "brewery-data-dashboard",
  },
];
