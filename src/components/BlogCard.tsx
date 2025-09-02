import { Link } from "react-router-dom";

interface BlogCardProps {
  title: string;
  author: string;
  date: string;
  tags: string[];
  slug: string;
  coverImage: string;
  authorImage: string;
  description: string;
  readingTime: number;
}

export default function BlogCard({
  title,
  author,
  date,
  tags,
  slug,
  coverImage,
  authorImage,
  description,
  readingTime,
}: BlogCardProps) {
  return (
    <Link
      to={`/blogs/${slug}`}
      className="relative group overflow-hidden rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.01] backdrop-blur-[8px] bg-white/30 dark:bg-black/30 border border-white/20"
    >
      {/* Cover Image */}
      <div className="h-40 lg:h-48 overflow-hidden rounded-t-2xl">
        <img
          src={coverImage}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-5 backdrop-blur-lg bg-white/60 dark:bg-zinc-900/50">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="bg-[hsl(110,25%,88%)] text-[hsl(110,30%,28%)] rounded-full px-3 py-1 text-xs font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-[hsl(220,9%,20%)] group-hover:text-[hsl(110,40%,40%)] transition-colors mb-2 font-serif leading-snug">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-[hsl(220,9%,38%)] line-clamp-3 mb-4">{description}</p>

        {/* Author Meta */}
        <div className="flex items-center gap-3 text-sm text-[hsl(220,10%,45%)]">
          <img
            src={authorImage}
            alt={author}
            className="w-8 h-8 rounded-full object-cover border border-white/30"
          />
          <div className="flex flex-col">
            <span className="text-[hsl(220,9%,25%)] font-medium">{author}</span>
            <span className="text-xs italic text-[hsl(220,10%,50%)]">
              {new Date(date).toLocaleDateString()} • {readingTime} min read
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
