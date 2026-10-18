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
  /** Where it was built, shown on its rack bay. */
  event?: string;
  buildFocus?: string;
  result?: string;
  kind?: "research";
}

export const projects: Project[] = [
  {
    id: 11,
    buildFocus: "HackRice team project · Garmin data and forecast serving.",
    result: "Recovery signals, a day-ahead forecast and a voice-enabled twin.",
    title: "BioTwin",
    description:
      "A digital twin for Garmin data. It reads Body Battery, sleep and heart rate, forecasts the day ahead, and tells you the best window to train.",
    fullDescription:
      "Wearables give you numbers; BioTwin gives you understanding. It reads Garmin data (heart rate, sleep, stress, Body Battery), shows the signals, forecasts Body Battery through the day ahead, picks a best training window around your calendar, and answers questions in plain language through a voice-enabled twin. Forecast models were fitted offline in MATLAB and served inside the API.",
    tech: ["Garmin data", "MATLAB", "Python", "Voice AI"],
    color:
      "bg-gradient-to-br from-accent-custom-primary/20 to-accent-custom-secondary/30",
    featured: true,
    codeUrl: "https://github.com/HackRice2026/BioTwin",
    blogSlug: "biotwin-body-battery-forecast",
    event: "HackRice · built in a weekend",
  },
  {
    id: 12,
    buildFocus:
      "TXST Shipathon project · agent-directed scenes and native iOS playback.",
    result: "Playable Romeo & Juliet chapters with voiced choices.",
    title: "PlayScript",
    description:
      "Classic books turned into playable chapters by a crew of agents. Make the character's decisions, hear them voiced, and see how far you strayed from the story.",
    fullDescription:
      "A literary interactive-fiction game that turns classic books into playable, bite-sized chapters. You play a character and make the decisions; at the end you get an analysis of how far you strayed from the original and what your choices say about you. It is agentic end to end: a director agent and a scene critic, a visual director, an animation agent, voice agents with emotive ElevenLabs speech, and a scripting agent, with two passes on the director and visual stages. Romeo & Juliet is the first story.",
    tech: ["Swift", "ElevenLabs", "Lottie", "Agents"],
    color:
      "bg-gradient-to-br from-accent-custom-primary/20 to-accent-custom-secondary/30",
    featured: true,
    codeUrl: "https://github.com/Txst-Shipaton/PlayScript",
    blogSlug: "playscript-romeo-juliet-ios",
    event: "TXST Shipathon",
  },
  {
    id: 13,
    buildFocus: "Team of three · real-time voice and live code context.",
    result: "A mock interview ending in a scored Hire / No Hire verdict.",
    title: "AI Interviewer: FAANG Prep",
    description:
      "A mock interview where the AI interviewer reads your code as you type, cross-questions your answers, and ends with a Hire or No Hire verdict.",
    fullDescription:
      "A real interview environment with an AI interviewer that gives live feedback, asks contextual questions and cross-questions what you actually said. A live editor syncs your solution to the interviewer every second, so it asks follow-ups about your real implementation. A feedback engine scores communication, code quality and problem solving and ends with a Hire or No Hire verdict. Reducing latency in real-time multimodal conversation was the main technical challenge. Built by a team of three at a Google interview-prep hackathon.",
    tech: ["Next.js", "Gemini", "Realtime voice", "TypeScript"],
    color:
      "bg-gradient-to-br from-accent-custom-primary/20 to-accent-custom-secondary/30",
    featured: true,
    codeUrl: "https://github.com/sh1vendra/Interview_Prep",
    blogSlug: "ai-interviewer-faang-prep",
    event: "Google interview-prep hackathon",
  },
  {
    id: 1,
    buildFocus:
      "Independent build · orchestration, fact verification and resumable rendering.",
    result: "A narrated, captioned video from one topic, plus a Shorts cut.",
    title: "VideoMaxx: Agentic Video Production Pipeline",
    description:
      "Turns a single topic into a finished, narrated, captioned video with animated data visualizations. Zero manual editing.",
    fullDescription:
      "A 15-stage agentic pipeline running fully locally on Apple Silicon. Gemini 2.5 Pro handles research, scripting, and self-critique; a two-pass fact-verification agent (Gemini grounding + Tavily cross-checks, SHA-256-hashed fact sheet) hard-blocks hallucinated claims before render; CLIP ranks visual assets per sentence; five Manim animation agents generate custom visualizations in parallel; Kokoro TTS narrates, WhisperX aligns word-level timestamps, and FFmpeg renders, finishing with a YouTube Shorts cut and upload via the YouTube Data API. Every stage is deterministic and resumable.",
    tech: [
      "Python",
      "Gemini 2.5 Pro",
      "Manim",
      "WhisperX",
      "FFmpeg",
      "CLIP",
      "Tavily",
    ],
    color:
      "bg-gradient-to-br from-accent-custom-primary/20 to-accent-custom-secondary/30",
    featured: true,
    codeUrl: "https://github.com/Rizsaurav/VideoMaxx",
    blogSlug: "videomaxx-agentic-video-pipeline",
  },
  {
    id: 2,
    title: "The Open-Weight Oligopoly",
    description:
      "A 20,000-model audit of the Hugging Face ecosystem: who actually holds the downloads, and whether open weights are centralizing.",
    fullDescription:
      "An empirical audit of the Hugging Face model hub across 20,000 models and 4,144 organizations. Downloads are extremely concentrated (Gini 0.918; the top 100 models take 48.4% of 2.84B monthly downloads), yet the ecosystem is organizationally decentralized: publisher HHI is only 375, and the top-10 organizations' share of new-model downloads fell from 78.6% in 2022 to 53.7% in 2026. A repeated cross-validation pipeline (OLS R2 0.148; random-forest AUC 0.723) shows downloads are predictable but far from deterministic. Every number is assertion-gated and reproducible from the public repo.",
    tech: [
      "Python",
      "Hugging Face API",
      "scikit-learn",
      "pandas",
      "matplotlib",
      "statsmodels",
    ],
    color:
      "bg-gradient-to-br from-accent-custom-primary/20 to-accent-custom-soft/30",
    featured: true,
    codeUrl: "https://github.com/Rizsaurav/-Open-Weight-Oligopoly",
    blogSlug: "open-weight-oligopoly",
    kind: "research",
  },
  {
    id: 3,
    title: "Chess Coach: Edge AI on Cloudflare",
    description:
      "Play a CPU at five ELO-calibrated levels or a friend, with instant move classification and Llama 3.3 coaching.",
    fullDescription:
      "An AI chess coaching app where everything, frontend, API, AI inference, session storage, runs on Cloudflare. A client-side minimax engine with alpha-beta pruning and difficulty-tuned noise plays at five ELO-calibrated levels (800–1800); every move is classified locally in under a millisecond (Best / Inaccuracy / Blunder…); and on-demand analysis from Llama 3.3 70B via Workers AI delivers natural-language critiques with concept tags, eval scores, and best-move arrows. Session state lives in SQLite-backed Durable Objects.",
    tech: [
      "React 19",
      "Cloudflare Workers",
      "Workers AI",
      "Llama 3.3 70B",
      "Durable Objects",
      "chess.js",
    ],
    color:
      "bg-gradient-to-br from-accent-custom-secondary/20 to-accent-custom-soft/40",
    featured: true,
    demoUrl: "https://chess-coach.rizsaurav.workers.dev/",
    codeUrl: "https://github.com/Rizsaurav/cf_ai_chess_coach",
    blogSlug: "chess-coach-edge-ai",
  },
  {
    id: 4,
    title: "Sortify: AI Document Organizer",
    description:
      "Auto-classifies academic files and answers questions over them with a RAG-powered chatbot.",
    fullDescription:
      "An AI-powered document organizer for students: it automatically classifies uploaded academic files, then lets you chat with them through a RAG-based semantic search chatbot built on PGVector and Sentence Transformers. FastAPI backend exposes REST endpoints; the React/TypeScript frontend handles uploads, browsing, and the chat interface.",
    tech: [
      "Python",
      "FastAPI",
      "React",
      "TypeScript",
      "PostgreSQL",
      "PGVector",
      "Sentence Transformers",
    ],
    color:
      "bg-gradient-to-br from-accent-custom-soft/30 to-accent-custom-primary/20",
    featured: true,
    codeUrl: "https://github.com/Rizsaurav/Sortify",
    blogSlug: "sortify-rag-document-organizer",
  },
  {
    id: 5,
    title: "T-Flash: Voice-First AI News Briefings",
    description:
      "Converts real-time headlines into AI-narrated audio briefings, by topic.",
    fullDescription:
      "A voice-first news pipeline for people who'd rather listen than scroll: commuters, multitaskers, and accessibility-focused users. Pick a topic and T-Flash fetches live headlines (NewsAPI), summarizes them with Gemini, converts to voice with ElevenLabs, and stores the audio in Supabase for playback. Orchestrated with n8n instead of a traditional backend; ships as a Next.js web app with a Flutter mobile client.",
    tech: [
      "Next.js",
      "Flutter",
      "n8n",
      "Gemini",
      "ElevenLabs",
      "Supabase",
      "NewsAPI",
    ],
    color:
      "bg-gradient-to-br from-accent-custom-secondary/20 to-accent-custom-primary/20",
    featured: false,
    codeUrl: "https://github.com/Rizsaurav/T-Flash",
    blogSlug: "tflash-news-to-audio",
  },
  {
    id: 6,
    title: "Soccer Highlights Generator",
    description:
      "Builds 10-minute highlight reels from full matches using audio excitement and computer vision.",
    fullDescription:
      "Full-stack system that watches a soccer match the way a human editor would: Librosa detects excitement spikes in the audio (crowd noise, commentary surges), while a BRIEF + k-Means bag-of-visual-words scene classifier scores action intensity frame by frame. Segments are stitched with context-preserving pre/post buffers so cuts feel natural, not choppy. FastAPI backend, Next.js frontend, MoviePy cutting pipeline.",
    tech: [
      "FastAPI",
      "Next.js",
      "OpenCV",
      "Librosa",
      "MoviePy",
      "scikit-learn",
    ],
    color:
      "bg-gradient-to-br from-accent-custom-soft/30 to-accent-custom-secondary/20",
    featured: false,
    codeUrl: "https://github.com/Rizsaurav/Soccer-Highlights-Generator",
    blogSlug: "soccer-highlights-generator",
  },
  {
    id: 8,
    title: "TRAC: ML Cheating Detection",
    description:
      "Autoencoder anomaly detection plus gaze simulation for flagging suspicious test-taking behavior.",
    fullDescription:
      "An ML pipeline for detecting cheating behavior: MediaPipe-based gaze tracking simulation, autoencoder anomaly detection over behavioral signals, and reinforcement-learning agents (stable-baselines3/Gymnasium) modeling gaze dynamics, with full training, evaluation, visualization, and demo tooling in PyTorch.",
    tech: [
      "Python",
      "PyTorch",
      "MediaPipe",
      "stable-baselines3",
      "scikit-learn",
      "OpenCV",
    ],
    color:
      "bg-gradient-to-br from-accent-custom-secondary/20 to-accent-custom-soft/30",
    featured: false,
    codeUrl: "https://github.com/Rizsaurav/TRAC",
    blogSlug: "trac-cheating-detection",
  },
  {
    id: 10,
    title: "Brewery Explorer",
    description:
      "A fast, searchable brewery explorer with interactive charts and shareable detail pages.",
    fullDescription:
      "A responsive React app over the Open Brewery DB API: live search and filtering across thousands of breweries, interactive charts, and dynamic routing so every brewery gets its own shareable URL. A frontend exercise in state management, data fetching, and keeping a big list feeling instant.",
    tech: ["React", "JavaScript", "REST API", "Charts"],
    color:
      "bg-gradient-to-br from-accent-custom-primary/30 to-accent-custom-secondary/20",
    featured: false,
    codeUrl: "https://github.com/Rizsaurav/Dashboard-Part02",
    blogSlug: "brewery-data-dashboard",
  },
];
