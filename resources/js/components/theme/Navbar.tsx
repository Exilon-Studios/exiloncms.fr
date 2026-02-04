/**
 * Theme Navbar Component - Placeholder
 */
export default function Navbar() {
  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">Logo</div>
          <div className="flex gap-4">
            <a href="/" className="text-sm hover:underline">Home</a>
            <a href="/blog" className="text-sm hover:underline">Blog</a>
          </div>
        </div>
      </div>
    </nav>
  );
}
