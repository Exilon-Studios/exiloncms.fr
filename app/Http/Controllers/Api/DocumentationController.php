<?php

namespace ExilonCMS\Http\Controllers\Api;

use ExilonCMS\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class DocumentationController extends Controller
{
    /**
     * Get documentation file tree for a locale
     */
    public function fileTree(Request $request, string $locale = 'fr')
    {
        $docsPath = base_path('docs/'.$locale);

        if (! File::exists($docsPath)) {
            return response()->json(['tree' => []]);
        }

        $tree = $this->buildFileTree($docsPath, $locale);

        return response()->json(['tree' => $tree]);
    }

    /**
     * Build file tree recursively
     */
    protected function buildFileTree(string $path, string $locale, string $relativePath = ''): array
    {
        $items = [];

        $directories = File::directories($path);
        $files = File::files($path);

        // Sort directories and files
        sort($directories);
        sort($files);

        // Add directories first
        foreach ($directories as $directory) {
            $name = basename($directory);
            $relativeName = $relativePath ? $relativePath.'/'.$name : $name;

            $items[] = [
                'type' => 'directory',
                'name' => $name,
                'path' => $relativeName,
                'locale' => $locale,
                'category' => explode('/', $relativeName)[0] ?? $name,
                'children' => $this->buildFileTree($directory, $locale, $relativeName),
            ];
        }

        // Add files
        foreach ($files as $file) {
            if ($file->getExtension() !== 'md') {
                continue;
            }

            $name = $file->getFilename();
            $relativeName = $relativePath ? $relativePath.'/'.$name : $name;
            $slug = str_replace('.md', '', $name);

            // Extract title from frontmatter
            $content = File::get($file->getPathname());
            $title = $this->extractTitle($content);

            $items[] = [
                'type' => 'file',
                'name' => $name,
                'title' => $title,
                'slug' => $slug,
                'path' => $relativeName,
                'locale' => $locale,
                'category' => explode('/', $relativeName)[0] ?? '',
            ];
        }

        return $items;
    }

    /**
     * Extract title from frontmatter
     */
    protected function extractTitle(string $content): string
    {
        if (preg_match('/^---[\s\S]*?title:\s*[\"|\'](.+?)[\"|\']\s*$/m', $content, $matches)) {
            return $matches[1];
        }

        return '';
    }
}
