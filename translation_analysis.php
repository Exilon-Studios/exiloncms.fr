<?php

/**
 * Translation System Audit Script
 *
 * This script analyzes the translation system in the MC-CMS V2 codebase.
 * It extracts:
 * 1. All translation keys USED in the codebase
 * 2. All translation keys DEFINED in language files
 * 3. Compares them to find unused, missing, and duplicate keys
 */

echo "=== MC-CMS V2 Translation System Audit ===\n\n";

// Base directory
$baseDir = __DIR__;

// Arrays to store results
$usedKeys = [];
$definedKeys = [];
$fileKeys = [];

// ============================================================================
// STEP 1: Extract all USED translation keys from PHP and JS/TS files
// ============================================================================

echo "Step 1: Extracting USED translation keys...\n";

// Search in PHP files
$phpFiles = array_merge(
    glob("$baseDir/app/**/*.php", GLOB_BRACE),
    glob("$baseDir/resources/**/*.php", GLOB_BRACE)
);

foreach ($phpFiles as $file) {
    $content = file_get_contents($file);

    // Match trans('key') and __("key")
    preg_match_all("/trans\s*\(\s*['\"]([^'\"]+)['\"]\s*\)/", $content, $matches1);
    preg_match_all("/__\s*\(\s*['\"]([^'\"]+)['\"]\s*\)/", $content, $matches2);
    preg_match_all("/@lang\s*\(\s*['\"]([^'\"]+)['\"]\s*\)/", $content, $matches3);

    $allMatches = array_merge($matches1[1] ?? [], $matches2[1] ?? [], $matches3[1] ?? []);

    foreach ($allMatches as $key) {
        if (!isset($usedKeys[$key])) {
            $usedKeys[$key] = [];
        }
        $usedKeys[$key][] = str_replace($baseDir . '\\', '', $file);
    }
}

// Search in JS/TS files for useTrans and trans patterns
$jsFiles = array_merge(
    glob("$baseDir/resources/js/**/*.{ts,tsx,js,jsx}", GLOB_BRACE)
);

foreach ($jsFiles as $file) {
    $content = file_get_contents($file);

    // Match t('key') from useTrans
    preg_match_all("/t\(['\"]([^'\"]+)['\"]\)/", $content, $matches1);

    // Match trans('key') function calls
    preg_match_all("/trans\(['\"]([^'\"]+)['\"]\)/", $content, $matches2);

    $allMatches = array_merge($matches1[1] ?? [], $matches2[1] ?? []);

    foreach ($allMatches as $key) {
        if (!isset($usedKeys[$key])) {
            $usedKeys[$key] = [];
        }
        $usedKeys[$key][] = str_replace($baseDir . '\\', '', $file);
    }
}

echo "Found " . count($usedKeys) . " unique USED translation keys\n\n";

// ============================================================================
// STEP 2: Extract all DEFINED translation keys from language files
// ============================================================================

echo "Step 2: Extracting DEFINED translation keys from language files...\n";

function extractKeysFromArray($array, $prefix = '') {
    $keys = [];

    foreach ($array as $key => $value) {
        $fullKey = $prefix === '' ? $key : $prefix . '.' . $key;

        if (is_array($value)) {
            $keys = array_merge($keys, extractKeysFromArray($value, $fullKey));
        } else {
            $keys[] = $fullKey;
        }
    }

    return $keys;
}

// French language files
$langFiles = [
    "$baseDir/resources/lang/fr/admin.php",
    "$baseDir/resources/lang/fr/auth.php",
    "$baseDir/resources/lang/fr/messages.php",
    "$baseDir/resources/lang/fr/puck.php",
];

// English language files
$langFilesEn = [
    "$baseDir/resources/lang/en/admin.php",
    "$baseDir/resources/lang/en/auth.php",
    "$baseDir/resources/lang/en/messages.php",
    "$baseDir/resources/lang/en/puck.php",
    "$baseDir/resources/lang/en/game.php",
    "$baseDir/resources/lang/en/errors.php",
    "$baseDir/resources/lang/en/mail.php",
    "$baseDir/resources/lang/en/passwords.php",
    "$baseDir/resources/lang/en/validation.php",
    "$baseDir/resources/lang/en/pagination.php",
];

foreach ($langFiles as $file) {
    if (file_exists($file)) {
        $langArray = include $file;
        $keys = extractKeysFromArray($langArray);
        $fileName = basename($file, '.php');

        foreach ($keys as $key) {
            $fullKey = $fileName . '.' . $key;
            $definedKeys[] = $fullKey;
            $fileKeys[$fullKey] = 'fr';
        }
    }
}

foreach ($langFilesEn as $file) {
    if (file_exists($file)) {
        $langArray = include $file;
        $keys = extractKeysFromArray($langArray);
        $fileName = basename($file, '.php');

        foreach ($keys as $key) {
            $fullKey = $fileName . '.' . $key;
            if (!isset($fileKeys[$fullKey])) {
                $definedKeys[] = $fullKey;
                $fileKeys[$fullKey] = 'en';
            }
        }
    }
}

$definedKeys = array_unique($definedKeys);
echo "Found " . count($definedKeys) . " unique DEFINED translation keys\n\n";

// ============================================================================
// STEP 3: Compare and categorize keys
// ============================================================================

echo "Step 3: Comparing keys and generating report...\n";

// Normalize keys for comparison (add file prefix if missing)
function normalizeKey($key) {
    // Keys from trans('admin.nav.dashboard') already have prefix
    // Keys from trans('nav.dashboard') need prefix based on context
    return $key;
}

// Find UNUSED keys (defined but never used)
$unusedKeys = [];
foreach ($definedKeys as $definedKey) {
    $used = false;

    // Check if this key or any parent key is used
    foreach ($usedKeys as $usedKey => $files) {
        if (strpos($usedKey, $definedKey) === 0 || strpos($definedKey, $usedKey) === 0) {
            // For more precise matching, check if the used key matches exactly
            if ($usedKey === $definedKey) {
                $used = true;
                break;
            }
        }
    }

    if (!$used) {
        $unusedKeys[] = $definedKey;
    }
}

// Find MISSING keys (used but not defined)
$missingKeys = [];
foreach ($usedKeys as $usedKey => $files) {
    $found = false;

    // Direct match
    if (in_array($usedKey, $definedKeys)) {
        $found = true;
    } else {
        // Check partial matches (for array access like admin.nav.dashboard)
        foreach ($definedKeys as $definedKey) {
            if (strpos($definedKey, $usedKey) === 0 || $usedKey === $definedKey) {
                $found = true;
                break;
            }
        }
    }

    if (!$found) {
        $missingKeys[$usedKey] = $files;
    }
}

// Find DUPLICATE keys (same key in multiple files)
$duplicateCheck = [];
foreach ($definedKeys as $key) {
    $baseKey = preg_replace('/^(admin|auth|messages|puck|game|errors|mail|passwords|validation|pagination)\./', '', $key);

    if (!isset($duplicateCheck[$baseKey])) {
        $duplicateCheck[$baseKey] = [];
    }
    $duplicateCheck[$baseKey][] = $key;
}

$duplicateKeys = [];
foreach ($duplicateCheck as $baseKey => $occurrences) {
    if (count($occurrences) > 1) {
        $duplicateKeys[$baseKey] = $occurrences;
    }
}

// ============================================================================
// STEP 4: Save results to files
// ============================================================================

echo "Step 4: Saving results to files...\n";

// Save used keys
file_put_contents(
    "$baseDir/translation_used_keys.txt",
    "=== USED TRANSLATION KEYS ===\n\n" .
    "Total: " . count($usedKeys) . " keys\n\n" .
    implode("\n", array_keys($usedKeys))
);
echo "Saved: translation_used_keys.txt\n";

// Save defined keys
file_put_contents(
    "$baseDir/translation_defined_keys.txt",
    "=== DEFINED TRANSLATION KEYS ===\n\n" .
    "Total: " . count($definedKeys) . " keys\n\n" .
    implode("\n", $definedKeys)
);
echo "Saved: translation_defined_keys.txt\n";

// Generate comprehensive report
$report = "# Translation System Audit Report\n\n";
$report .= "Generated: " . date('Y-m-d H:i:s') . "\n\n";

$report .= "## Summary\n\n";
$report .= "- **Total keys defined**: " . count($definedKeys) . "\n";
$report .= "- **Total keys used**: " . count($usedKeys) . "\n";
$report .= "- **Unused keys**: " . count($unusedKeys) . "\n";
$report .= "- **Missing keys**: " . count($missingKeys) . "\n";
$report .= "- **Duplicate patterns**: " . count($duplicateKeys) . "\n\n";

$report .= "## 1. Unused Keys (Defined but Never Used)\n\n";
$report .= "These keys are defined in language files but are not referenced anywhere in the codebase.\n\n";
$report .= "Total: " . count($unusedKeys) . " keys\n\n";

if (count($unusedKeys) > 0) {
    // Group by file
    $groupedUnused = [];
    foreach ($unusedKeys as $key) {
        $parts = explode('.', $key);
        $file = $parts[0];
        if (!isset($groupedUnused[$file])) {
            $groupedUnused[$file] = [];
        }
        $groupedUnused[$file][] = $key;
    }

    foreach ($groupedUnused as $file => $keys) {
        $report .= "### $file.php\n\n";
        $report .= "```\n";
        $report .= implode("\n", $keys);
        $report .= "\n```\n\n";
    }
} else {
    $report .= "✅ No unused keys found! All defined keys are being used.\n\n";
}

$report .= "## 2. Missing Keys (Used but Not Defined)\n\n";
$report .= "These keys are referenced in the code but not defined in language files.\n\n";
$report .= "Total: " . count($missingKeys) . " keys\n\n";

if (count($missingKeys) > 0) {
    foreach ($missingKeys as $key => $files) {
        $report .= "### `$key`\n\n";
        $report .= "**Used in:**\n";
        foreach (array_unique($files) as $file) {
            $report .= "- `$file`\n";
        }
        $report .= "\n";
    }
} else {
    $report .= "✅ No missing keys found! All used keys are defined.\n\n";
}

$report .= "## 3. Duplicate/Overlapping Keys\n\n";
$report .= "These keys appear to be duplicated or have overlapping names across different files.\n\n";
$report .= "Total: " . count($duplicateKeys) . " patterns\n\n";

if (count($duplicateKeys) > 0) {
    foreach ($duplicateKeys as $baseKey => $occurrences) {
        $report .= "### `$baseKey`\n\n";
        foreach ($occurrences as $occurrence) {
            $report .= "- `$occurrence`\n";
        }
        $report .= "\n";
    }
} else {
    $report .= "✅ No duplicate patterns found!\n\n";
}

$report .= "## 4. Most Used Keys\n\n";
$report .= "Top 20 most frequently used translation keys:\n\n";

uasort($usedKeys, function($a, $b) {
    return count($b) - count($a);
});

$topKeys = array_slice($usedKeys, 0, 20, true);
foreach ($topKeys as $key => $files) {
    $report .= (count($files) < 10 ? ' ' : '') . count($files) . " usages: `$key`\n";
}

$report .= "\n";

$report .= "## 5. Recommendations\n\n";

if (count($unusedKeys) > 50) {
    $report .= "⚠️ **High number of unused keys** (" . count($unusedKeys) . ")\n\n";
    $report .= "- Consider removing unused translation keys to reduce maintenance overhead\n";
    $report .= "- Unused keys bloat the language files and make translation harder\n";
    $report .= "- Review the unused keys list above and remove entries that are truly obsolete\n\n";
} elseif (count($unusedKeys) > 0) {
    $report .= "ℹ️ **Some unused keys found** (" . count($unusedKeys) . ")\n\n";
    $report .= "- Review the unused keys list to determine if they can be safely removed\n";
    $report .= "- Some keys might be used dynamically or in ways not detected by this script\n\n";
} else {
    $report .= "✅ **No unused keys** - Excellent! All defined keys are being used.\n\n";
}

if (count($missingKeys) > 0) {
    $report .= "⚠️ **Missing translation keys** (" . count($missingKeys) . ")\n\n";
    $report .= "- Add the missing keys to the appropriate language files\n";
    $report .= "- Missing keys will cause translation failures or fallback to key names\n";
    $report .= "- Pay special attention to keys used in user-facing components\n\n";
} else {
    $report .= "✅ **No missing keys** - All used keys are properly defined.\n\n";
}

$report .= "### Best Practices\n\n";
$report .= "1. **Keep translations in sync**: When adding new features, add translation keys for all supported languages\n";
$report .= "2. **Use consistent naming**: Follow the existing pattern (file.category.key)\n";
$report .= "3. **Remove unused keys**: Periodically clean up translation files\n";
$report .= "4. **Document dynamic keys**: Some keys might be constructed dynamically - document these patterns\n";
$report .= "5. **Test all languages**: Ensure all pages work correctly in different languages\n\n";

$report .= "---\n\n";
$report .= "*This report was generated automatically by the translation audit script.*\n";

file_put_contents("$baseDir/translation_audit_report.md", $report);
echo "Saved: translation_audit_report.md\n";

echo "\n=== Audit Complete ===\n";
echo "Files generated:\n";
echo "  - translation_used_keys.txt\n";
echo "  - translation_defined_keys.txt\n";
echo "  - translation_audit_report.md\n";
