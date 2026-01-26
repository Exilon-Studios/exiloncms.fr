<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="scroll-smooth">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'ExilonCMS') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

    <!-- Favicon -->
    @if (setting('icon'))
        <link rel="icon" type="image/png" href="{{ image_url(setting('icon')) }}">
    @else
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎨</text></svg>">
    @endif

    <!-- Tailwind CSS (loaded via Vite) -->
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])

    <!-- Theme CSS -->
    <link rel="stylesheet" href="{{ asset('themes/saazy/css/style.css') }}">

    <!-- Custom styles for Saazy theme -->
    <style>
        :root {
            --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
        }

        body {
            font-family: var(--font-sans);
        }

        /* Scrollbar styling */
        ::-webkit-scrollbar {
            width: 10px;
        }

        ::-webkit-scrollbar-track {
            background: hsl(var(--muted));
        }

        ::-webkit-scrollbar-thumb {
            background: hsl(var(--primary) / 0.5);
            border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: hsl(var(--primary));
        }

        /* Smooth scroll */
        html {
            scroll-behavior: smooth;
        }

        /* Grid pattern for backgrounds */
        .bg-grid-pattern {
            background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
            background-size: 50px 50px;
        }

        @media (prefers-color-scheme: dark) {
            .bg-grid-pattern {
                background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
            }
        }
    </style>

    @inertiaHead
</head>
<body class="bg-background text-foreground antialiased">
    @inertia

    <!-- Theme JavaScript -->
    <script src="{{ asset('themes/saazy/js/app.js') }}" defer></script>
</body>
</html>
