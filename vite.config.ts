import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

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
        },
    },
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
