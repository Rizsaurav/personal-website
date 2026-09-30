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
    id: 3,
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
    id: 4,
    title: "Cycling Safety Gaps: San Marcos (Geospatial ML)",
    description: "A four-notebook geospatial ML audit of San Marcos bike infrastructure, with a deployed Streamlit app.",
    fullDescription: "A data-science audit of cycling safety in San Marcos, TX. Built a network skeleton from city GIS layers (bike facilities, routes, centerlines, lighting, sidewalks) fused with TxDOT AADT traffic counts, then ran probabilistic enrichment, spatial engineering, and graph-based ML to score segment-level risk. Outputs the top-10 critical failure segments as GeoJSON, with an interactive Streamlit app for exploration.",
    tech: ["Python", "GeoPandas", "scikit-learn", "NetworkX", "Streamlit", "TxDOT AADT"],
    color: "bg-gradient-to-br from-accent-custom-primary/20 to-accent-custom-soft/30",
    featured: true,
    codeUrl: "https://github.com/Rizsaurav/SAFETY-GAPS-FACING-SAN-MARCOS-CYCLISTS",
    blogSlug: "san-marcos-cycling-safety",
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
    title: "Brewery Data Dashboard",
    description: "Searchable, filterable brewery explorer with charts and deep-linked detail pages.",
    fullDescription: "A responsive React dashboard over the Open Brewery DB API: live search and filtering across thousands of breweries, multiple charts telling different stories in the data, and dynamic routing so every brewery detail view has its own shareable URL.",
    tech: ["React", "JavaScript", "REST API", "Charts"],
    color: "bg-gradient-to-br from-accent-custom-primary/30 to-accent-custom-secondary/20",
    featured: false,
    codeUrl: "https://github.com/Rizsaurav/Dashboard-Part02",
    blogSlug: "brewery-data-dashboard",
  },
];
