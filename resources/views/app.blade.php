<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <!-- SEO Meta Tags -->
        <title inertia>{{ setting('name', config('app.name', 'ExilonCMS')) }}</title>
        <meta name="description" content="{{ setting('description', 'ExilonCMS - Modern Content Management System for game servers') }}">
        <meta name="keywords" content="cms, minecraft, game server, laravel, inertia, react">

        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:title" content="{{ setting('name', config('app.name', 'ExilonCMS')) }}">
        <meta property="og:description" content="{{ setting('description', 'ExilonCMS - Modern Content Management System for game servers') }}">
        @if(setting('og_image'))
            <meta property="og:image" content="{{ image_url(setting('og_image')) }}">
        @endif

        <!-- Twitter -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ setting('name', config('app.name', 'ExilonCMS')) }}">
        <meta name="twitter:description" content="{{ setting('description', 'ExilonCMS - Modern Content Management System for game servers') }}">
        @if(setting('og_image'))
            <meta name="twitter:image" content="{{ image_url(setting('og_image')) }}">
        @endif

        <!-- Favicon -->
        <link rel="shortcut icon" href="{{ favicon() }}">
        <link rel="icon" type="image/svg+xml" href="{{ favicon() }}">

        @php
            $activeTheme = app(\ExilonCMS\Extensions\Theme\ThemeLoader::class)->getActiveThemeId();

            // Get colors from settings, with proper fallback
            $primaryColor = setting('primary_color');
            $secondaryColor = setting('secondary_color');

            // If not set or "default", use the actual default colors
            if (!$primaryColor || $primaryColor === 'default') {
                $primaryColor = '#3b82f6'; // blue-500
            }
            if (!$secondaryColor || $secondaryColor === 'default') {
                $secondaryColor = '#8b5cf6'; // violet-500
            }

            $primaryForeground = color_contrast($primaryColor);
            $secondaryForeground = color_contrast($secondaryColor);
        @endphp

        <!-- Active Theme Styles (CMS colors injected as HSL for Tailwind) -->
        <style>
            :root {
                /* Tailwind primary - HSL format */
                --primary: {!! hex2hsl_value($primaryColor) !!};
                --primary-foreground: {!! hex2hsl_value($primaryForeground) !!};

                /* Tailwind secondary - HSL format */
                --secondary: {!! hex2hsl_value($secondaryColor) !!};
                --secondary-foreground: {!! hex2hsl_value($secondaryForeground) !!};

                /* Ring color */
                --ring: {!! hex2hsl_value($primaryColor) !!};
            }
        </style>

        <!-- Active Theme Script -->
        <script>
            window.__exiloncms_theme = {!! json_encode($activeTheme) !!};
        </script>

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
        @inertiaHead
    </head>
    <body class="font-sans antialiased bg-background text-foreground">
        @inertia
    </body>
</html>
