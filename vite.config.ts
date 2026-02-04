import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// Get all available themes
function getAvailableThemes(): string[] {
    const themesDir = path.resolve(__dirname, 'themes');
    if (!fs.existsSync(themesDir)) {
        return [];
    }

    return fs.readdirSync(themesDir).filter(theme => {
        const themePath = path.join(themesDir, theme);
        return fs.statSync(themePath).isDirectory();
    });
}

// Get all theme CSS files that exist
function getThemeCssFiles(): string[] {
    const themes = getAvailableThemes();
    const cssFiles: string[] = [];

    for (const theme of themes) {
        const themeCss = `themes/${theme}/resources/css/theme.css`;
        if (fs.existsSync(path.resolve(__dirname, themeCss))) {
            cssFiles.push(themeCss);
        }
    }

    return cssFiles;
}

// Get all theme entry points
function getThemeEntries(): Record<string, string> {
    const themes = getAvailableThemes();
    const entries: Record<string, string> = {};

    for (const theme of themes) {
        const themeJs = `themes/${theme}/resources/js/app.tsx`;
        if (fs.existsSync(path.resolve(__dirname, themeJs))) {
            entries[theme] = themeJs;
        }
    }

    return entries;
}

// Get all plugin entry points
function getPluginEntries(): Record<string, string> {
    const pluginsDir = path.resolve(__dirname, 'plugins');
    if (!fs.existsSync(pluginsDir)) {
        return {};
    }

    const entries: Record<string, string> = {};
    const plugins = fs.readdirSync(pluginsDir).filter(plugin => {
        const pluginPath = path.join(pluginsDir, plugin);
        return fs.statSync(pluginPath).isDirectory();
    });

    for (const plugin of plugins) {
        const pluginJs = `plugins/${plugin}/resources/js/app.tsx`;
        if (fs.existsSync(path.resolve(__dirname, pluginJs))) {
            entries[plugin] = pluginJs;
        }
    }

    return entries;
}

// Build the complete input object
function buildInputs() {
    const themeEntries = getThemeEntries();
    const pluginEntries = getPluginEntries();
    const themeCssFiles = getThemeCssFiles();

    // Core app
    const inputs: any = {
        'resources/css/app.css': 'resources/css/app.css',
        'resources/js/app.tsx': 'resources/js/app.tsx',
    };

    // Theme entries
    Object.entries(themeEntries).forEach(([theme, entry]) => {
        inputs[`themes/${theme}`] = entry;
    });

    // Plugin entries
    Object.entries(pluginEntries).forEach(([plugin, entry]) => {
        inputs[`plugins/${plugin}`] = entry;
    });

    // Theme CSS files
    themeCssFiles.forEach(cssFile => {
        inputs[cssFile] = cssFile;
    });

    return inputs;
}

export default defineConfig({
    plugins: [
        laravel({
            input: buildInputs(),
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
            // Plugin aliases for plugin page imports
            'plugins/shop': path.resolve(__dirname, './plugins/shop/resources/js'),
            'plugins/blog': path.resolve(__dirname, './plugins/blog/resources/js'),
        },
    },
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
