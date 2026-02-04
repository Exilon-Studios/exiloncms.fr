import { IconCircle } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

interface DocTableOfContentsProps {
  headings: {
    id: string;
    text: string;
    level: number;
    depth: number;
  }[];
}

export default function DocTableOfContents({ headings }: DocTableOfContentsProps) {
  const [activeHeading, setActiveHeading] = useState<string>('');

  useEffect(() => {
    // Intersection observer to highlight current heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px', // Highlight when heading is near top
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const top = element.offsetTop - 80; // Offset for fixed header
      window.scrollTo({ top, behavior: 'smooth' });
      setActiveHeading(id);
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="sticky top-14">
      <h4 className="text-sm font-semibold mb-3">Sur cette page</h4>

      <nav className="flex flex-col gap-2 text-sm">
        {headings.map((heading) => (
          <button
            key={heading.id}
            onClick={() => handleClick(heading.id)}
            className={`
              text-left transition-colors hover:text-foreground
              ${activeHeading === heading.id ? 'text-foreground font-medium' : 'text-muted-foreground'}
            `}
            style={{ paddingLeft: `${heading.depth * 0.75}rem` }}
          >
            <div className="flex items-start gap-2">
              <IconCircle
                className={`
                  h-2 w-2 mt-1.5 flex-shrink-0 transition-colors
                  ${activeHeading === heading.id ? 'fill-current text-primary' : 'fill-muted-foreground/30'}
                `}
              />
              <span>{heading.text}</span>
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
}
