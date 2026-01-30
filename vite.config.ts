import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// Get active theme from settings
function getActiveTheme(): string | null {
    try {
        const envPath = path.resolve(__dirname, '.env');
        if (!fs.existsSync(envPath)) {
            return 'blog'; // Default theme
        }

        const envContent = fs.readFileSync(envPath, 'utf-8');
        // This is a simple check - in production, the theme comes from database
        // For build time, we use the default theme
        return 'blog';
    } catch {
        return 'blog';
    }
}

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js'),
            '@/components': path.resolve(__dirname, './resources/js/components'),
            '@/layouts': path.resolve(__dirname, './resources/js/layouts'),
            '@/pages': path.resolve(__dirname, './resources/js/pages'),
            '@/types': path.resolve(__dirname, './resources/js/types'),
            '@/lib': path.resolve(__dirname, './resources/js/lib'),
            '@/hooks': path.resolve(__dirname, './resources/js/hooks'),
            '@/plugins': path.resolve(__dirname, './plugins'),
            // Theme aliases - dynamically resolved based on active theme
            '@/theme': path.resolve(__dirname, './themes/blog/resources/js'),
            '@/themePages': path.resolve(__dirname, './themes/blog/resources/js/pages'),
        },
    },
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
