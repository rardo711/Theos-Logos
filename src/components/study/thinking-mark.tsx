import { cn } from "@/lib/utils";

type LampWait = "composing" | "searching" | "breathing";

/**
 * Twelve turning leaves on a 5.4s loop: two quick flips left (0.25s each),
 * one slightly slower flip right (0.5s), repeating. Negative delays spread
 * the leaves across the loop so the motion is alive from the first frame.
 * Every leaf turns in front of the book; the book itself never moves.
 */
const BIBLE_LEAVES: { right: boolean; delay: string }[] = [
  { right: false, delay: "-0.1s" },
  { right: false, delay: "-0.5s" },
  { right: true, delay: "-0.9s" },
  { right: false, delay: "-1.3s" },
  { right: false, delay: "-1.7s" },
  { right: true, delay: "-2.1s" },
  { right: false, delay: "-2.5s" },
  { right: false, delay: "-2.9s" },
  { right: true, delay: "-3.3s" },
  { right: false, delay: "-3.7s" },
  { right: false, delay: "-4.1s" },
  { right: true, delay: "-4.5s" },
];

const BIBLE_LINES_LEFT = [
  "M28 13.5C32 12.5 36 12.5 39.5 13.5",
  "M28 17.5C32 16.5 36 16.5 39.5 17.5",
  "M28 21.5C32 20.5 36 20.5 39.5 21.5",
];

const BIBLE_LINES_RIGHT = [
  "M20 13.5C16 12.5 12 12.5 8.5 13.5",
  "M20 17.5C16 16.5 12 16.5 8.5 17.5",
  "M20 21.5C16 20.5 12 20.5 8.5 21.5",
];

function Bible({
  state,
  className,
}: {
  state: LampWait;
  className?: string;
}) {
  return (
    <span
      className={cn("tl-bible", `tl-bible-${state}`, className)}
      role="img"
      aria-label="Loading"
    >
      <svg
        viewBox="0 0 48 38"
        fill="none"
        aria-hidden="true"
        className="tl-bible-svg"
      >
        <defs>
          <path
            id="tl-bible-leaf"
            d="M24 8.8C30 6.6 37 6.6 42.6 8.8L42.6 26.8C37 24.8 30 25 24 27.2Z"
          />
          <path
            id="tl-bible-leaf-r"
            d="M24 8.8C18 6.6 11 6.6 5.4 8.8L5.4 26.8C11 24.8 18 25 24 27.2Z"
          />
          <linearGradient id="tl-bible-sh-l" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0" stopColor="#000" stopOpacity=".12" />
            <stop offset=".45" stopColor="#000" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="tl-bible-sh-r" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#000" stopOpacity=".12" />
            <stop offset=".45" stopColor="#000" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="tl-bible-valley" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#000" stopOpacity="0" />
            <stop offset=".5" stopColor="#000" stopOpacity=".22" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </linearGradient>
          <filter
            id="tl-bible-blur"
            x="-40%"
            y="-40%"
            width="180%"
            height="180%"
          >
            <feGaussianBlur stdDeviation="1.4" />
          </filter>
        </defs>
        <ellipse
          cx="24"
          cy="33.4"
          rx="16.5"
          ry="2.1"
          fill="#3a1408"
          opacity=".13"
          filter="url(#tl-bible-blur)"
        />
        <g strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path
            className="tl-bible-ink"
            d="M24 8C18 5.5 10 5.5 4 8L4 28C10 25.5 18 25.5 24 28Z"
            fill="var(--color-surface)"
          />
          <path
            d="M24 8C18 5.5 10 5.5 4 8L4 28C10 25.5 18 25.5 24 28Z"
            fill="url(#tl-bible-sh-l)"
          />
          <path
            className="tl-bible-ink"
            d="M24 8C30 5.5 38 5.5 44 8L44 28C38 25.5 30 25.5 24 28Z"
            fill="var(--color-surface)"
          />
          <path
            d="M24 8C30 5.5 38 5.5 44 8L44 28C38 25.5 30 25.5 24 28Z"
            fill="url(#tl-bible-sh-r)"
          />
          <rect
            x="20"
            y="7"
            width="8"
            height="22"
            rx="4"
            fill="url(#tl-bible-valley)"
          />
          <path
            className="tl-bible-ink"
            d="M24 8C23.6 15 24.4 22 24 28"
          />
        </g>
        {BIBLE_LEAVES.map((leaf, i) => (
          <g
            key={i}
            className={leaf.right ? "tl-bible-turn-r" : "tl-bible-turn"}
            style={{ animationDelay: leaf.delay }}
          >
            <use
              href={leaf.right ? "#tl-bible-leaf-r" : "#tl-bible-leaf"}
              fill="var(--color-surface)"
              className="tl-bible-ink"
              strokeWidth="1.4"
            />
            <g
              className="tl-bible-lines"
              strokeWidth="1.1"
              strokeLinecap="round"
              fill="none"
            >
              {(leaf.right ? BIBLE_LINES_RIGHT : BIBLE_LINES_LEFT).map((d) => (
                <path key={d} d={d} />
              ))}
            </g>
          </g>
        ))}
      </svg>
    </span>
  );
}

/** Small Bible for a search or a written answer. Chapter opening does not use this. */
export function LampMark({
  state = "searching",
  className,
}: {
  state?: LampWait;
  className?: string;
}) {
  return <Bible state={state} className={className} />;
}

/**
 * The Bible while a long answer is written. Stays hidden for the first
 * moment so a cached answer never flashes.
 */
export function ThinkingMark({
  active,
  state,
  label,
  className,
}: {
  active: boolean;
  state: LampWait;
  label: string;
  className?: string;
}) {
  if (!active) return null;

  return (
    <p
      className={cn(
        "flex items-center gap-2.5 font-serif text-sm text-muted italic",
        className,
      )}
      role="status"
    >
      <Bible state={state} className="tl-bible-lg" />
      {label}
    </p>
  );
}
