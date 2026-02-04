<?php

if (! function_exists('hex2rgb')) {
    /**
     * Extract the RGB values from a hex color.
     */
    function hex2rgb(string $hex): array
    {
        $color = ltrim($hex, '#');

        if (strlen($color) === 3) {
            $color = $color[0].$color[0].$color[1].$color[1].$color[2].$color[2];
        }

        if (strlen($color) !== 6) {
            throw new InvalidArgumentException('Invalid hex color: '.$hex);
        }

        return array_map(hexdec(...), str_split($color, 2));
    }
}

if (! function_exists('color_contrast')) {
    /**
     * Return the color (black or white) with the best contrast for the given hex color.
     */
    function color_contrast(string $hex): string
    {
        [$r, $g, $b] = hex2rgb($hex);
        $yiq = (($r * 299) + ($g * 587) + ($b * 114)) / 1000;

        return ($yiq >= 128) ? '#000' : '#fff';
    }
}

if (! function_exists('color_rgb')) {
    /**
     * Convert a hex color to the RGB values separated by commas.
     */
    function color_rgb(string $hex): string
    {
        return implode(', ', hex2rgb($hex));
    }
}

if (! function_exists('color_mix')) {
    /**
     * Mix two hex colors with the given ratio.
     */
    function color_mix(string $color1, string $color2, float $ratio = 0.5): string
    {
        [$r1, $g1, $b1] = hex2rgb($color1);
        [$r2, $g2, $b2] = hex2rgb($color2);

        $r = (int) round($r1 * $ratio + $r2 * (1 - $ratio));
        $g = (int) round($g1 * $ratio + $g2 * (1 - $ratio));
        $b = (int) round($b1 * $ratio + $b2 * (1 - $ratio));

        return sprintf('#%02x%02x%02x', $r, $g, $b);
    }
}

if (! function_exists('color_shade')) {
    /**
     * Shade a hex color with the given ratio.
     */
    function color_shade(string $hex, float $ratio): string
    {
        return color_mix('#000000', $hex, $ratio);
    }
}

if (! function_exists('color_tint')) {
    /**
     * Tint a hex color with the given ratio.
     */
    function color_tint(string $hex, float $ratio): string
    {
        return color_mix('#ffffff', $hex, $ratio);
    }
}

if (! function_exists('hex2hsl')) {
    /**
     * Convert a hex color to HSL format for Tailwind CSS.
     * Returns format: "hsl(h, s%, l%)"
     */
    function hex2hsl(string $hex): string
    {
        [$r, $g, $b] = hex2rgb($hex);

        $r /= 255;
        $g /= 255;
        $b /= 255;

        $max = max($r, $g, $b);
        $min = min($r, $g, $b);
        $l = ($max + $min) / 2;

        if ($max === $min) {
            $h = $s = 0;
        } else {
            $d = $max - $min;
            $s = $l > 0.5 ? $d / (2 - $max - $min) : $d / ($max + $min);

            switch ($max) {
                case $r:
                    $h = (($g - $b) / $d + ($g < $b ? 6 : 0)) / 6;
                    break;
                case $g:
                    $h = (($b - $r) / $d + 2) / 6;
                    break;
                case $b:
                    $h = (($r - $g) / $d + 4) / 6;
                    break;
            }
        }

        return sprintf('%d %d%% %d%%', round($h * 360), round($s * 100), round($l * 100));
    }
}

if (! function_exists('hex2hsl_value')) {
    /**
     * Convert a hex color to HSL value only (no hsl() wrapper).
     * Returns format: "h s l" for use in CSS custom properties
     */
    function hex2hsl_value(string $hex): string
    {
        $hsl = hex2hsl($hex);

        return str_replace('hsl(', '', str_replace(')', '', $hsl));
    }
}
