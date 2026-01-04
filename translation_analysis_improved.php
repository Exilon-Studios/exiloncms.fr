<?php

/**
 * Improved Translation System Audit Script
 * More accurate detection of translation usage in the codebase
 */

echo "=== MC-CMS V2 Translation System Audit (Improved) ===\n\n";

$baseDir = __DIR__;
$usedKeys = [];
$definedKeys = [];

// ============================================================================
// STEP 1: Extract USED keys more accurately
// ============================================================================

echo "Step 1: Extracting USED translation keys (accurate mode)...\n";

// PHP files - trans() and __()
$phpFiles = array_merge(
    glob("$baseDir/app/**/*.php", GLOB_BRACE),
    glob("$baseDir/resources/**/*.php", GLOB_BRACE)
);

foreach ($phpFiles as $file) {
    $content = file_get_contents($file);

    // Match trans('key') with proper filtering
    preg_match_all("/trans\s*\(\s*['\"]([^'\"]+)['\"]\s*[,\)]/", $content, $matches1);
    // Match __("key")
    preg_match_all("/__\s*\(\s*['\"]([^'\"]+)['\"]\s*[,\)]/", $content, $matches2);
    // Match @lang('key')
    preg_match_all("/@lang\s*\(\s*['\"]([^'\"]+)['\"]\s*\)/", $content, $matches3);

    $allMatches = array_merge($matches1[1] ?? [], $matches2[1] ?? [], $matches3[1] ?? []);

    foreach ($allMatches as $key) {
        // Filter out non-translation strings
        if (preg_match('/^(\/|https?|#|[0-9]+$|\.{1,2}$|[A-Z]{2,}$)/', $key)) {
            continue;
        }
        if (!isset($usedKeys[$key])) {
            $usedKeys[$key] = [];
        }
        $usedKeys[$key][] = str_replace($baseDir . '\\', '', $file);
    }
}

// JS/TS files - look for t('key') and trans('key')
$jsFiles = array_merge(
    glob("$baseDir/resources/js/**/*.{ts,tsx,js,jsx}", GLOB_BRACE)
);

foreach ($jsFiles as $file) {
    $content = file_get_contents($file);

    // Match t('key') pattern (from useTrans)
    preg_match_all("/\bt\s*\(\s*['\"]([^'\"]+)['\"]\s*\)/", $content, $matches1);

    // Match trans('key') function calls
    preg_match_all("/trans\s*\(\s*['\"]([^'\"]+)['\"]\s*[,\)]/", $content, $matches2);

    $allMatches = array_merge($matches1[1] ?? [], $matches2[1] ?? []);

    foreach ($allMatches as $key) {
        // Filter out non-translation strings
        if (preg_match('/^(\/|https?|#|[0-9]+$|\.{1,2}$|[A-Z]{2,}$)/', $key)) {
            continue;
        }
        if (!isset($usedKeys[$key])) {
            $usedKeys[$key] = [];
        }
        $usedKeys[$key][] = str_replace($baseDir . '\\', '', $file);
    }
}

echo "Found " . count($usedKeys) . " unique USED translation keys\n\n";

// ============================================================================
// STEP 2: Extract DEFINED keys
// ============================================================================

echo "Step 2: Extracting DEFINED translation keys...\n";

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

$langFiles = [
    "$baseDir/resources/lang/fr/admin.php",
    "$baseDir/resources/lang/fr/auth.php",
    "$baseDir/resources/lang/fr/messages.php",
    "$baseDir/resources/lang/fr/puck.php",
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
            if (!in_array($fullKey, $definedKeys)) {
                $definedKeys[] = $fullKey;
            }
        }
    }
}

echo "Found " . count($definedKeys) . " unique DEFINED translation keys\n\n";

// ============================================================================
// STEP 3: Compare and categorize
// ============================================================================

echo "Step 3: Comparing and categorizing keys...\n";

// Build a set of all possible key patterns
$definedSet = array_flip($definedKeys);

// Find UNUSED keys
$unusedKeys = [];
foreach ($definedKeys as $definedKey) {
    $found = false;

    // Check if this key is directly used
    if (isset($usedKeys[$definedKey])) {
        continue;
    }

    // Check if any parent key is used (e.g., admin.nav if admin.nav.dashboard is used)
    $parts = explode('.', $definedKey);
    for ($i = count($parts) - 1; $i > 0; $i--) {
        $parentKey = implode('.', array_slice($parts, 0, $i));
        if (isset($usedKeys[$parentKey])) {
            $found = true;
            break;
        }
    }

    // Check if any child key is used
    foreach ($usedKeys as $usedKey => $files) {
        if (strpos($usedKey, $definedKey . '.') === 0) {
            $found = true;
            break;
        }
    }

    if (!$found) {
        $unusedKeys[] = $definedKey;
    }
}

// Find MISSING keys
$missingKeys = [];
foreach ($usedKeys as $usedKey => $files) {
    $found = false;

    // Direct match
    if (isset($definedSet[$usedKey])) {
        continue;
    }

    // Check if this is a parent of a defined key
    foreach ($definedKeys as $definedKey) {
        if (strpos($definedKey, $usedKey . '.') === 0) {
            $found = true;
            break;
        }
    }

    if (!$found) {
        $missingKeys[$usedKey] = $files;
    }
}

// Find DUPLICATE patterns
$duplicates = [];
$seenKeys = [];

foreach ($definedKeys as $key) {
    // Remove file prefix
    $parts = explode('.', $key);
    if (count($parts) > 1) {
        $baseKey = implode('.', array_slice($parts, 1));

        if (!isset($seenKeys[$baseKey])) {
            $seenKeys[$baseKey] = [];
        }
        $seenKeys[$baseKey][] = $key;
    }
}

foreach ($seenKeys as $baseKey => $occurrences) {
    if (count($occurrences) > 1) {
        $duplicates[$baseKey] = $occurrences;
    }
}

echo "Categorization complete\n\n";

// ============================================================================
// STEP 4: Generate detailed report
// ============================================================================

echo "Step 4: Generating detailed report...\n";

$report = "# Translation System Audit Report - MC-CMS V2\n\n";
$report .= "**Generated:** " . date('Y-m-d H:i:s') . "\n\n";
$report .= "---\n\n";

// Executive Summary
$report .= "## Executive Summary\n\n";
$report .= "| Metric | Count |\n";
$report .= "|--------|-------|\n";
$report .= "| **Total keys defined** | " . count($definedKeys) . " |\n";
$report .= "| **Total keys used** | " . count($usedKeys) . " |\n";
$report .= "| **Unused keys** | " . count($unusedKeys) . " (" . round(count($unusedKeys) / count($definedKeys) * 100, 1) . "%) |\n";
$report .= "| **Missing keys** | " . count($missingKeys) . " |\n";
$report .= "| **Duplicate patterns** | " . count($duplicates) . " |\n";
$report .= "| **Coverage** | " . round((count($definedKeys) - count($unusedKeys)) / count($definedKeys) * 100, 1) . "% |\n\n";

// Health score
$healthScore = 100;
$healthScore -= min(count($missingKeys) * 2, 30); // Up to 30 points for missing keys
$healthScore -= min(count($unusedKeys) / count($definedKeys) * 100, 50); // Up to 50 points for unused
$healthScore = max($healthScore, 0);

$report .= "### Health Score: " . ($healthScore >= 80 ? "🟢 Good" : ($healthScore >= 50 ? "🟡 Fair" : "🔴 Poor")) . " ($healthScore/100)\n\n";

// Most used keys
$report .= "## Most Used Translation Keys\n\n";
$report .= "Top 20 most frequently referenced translation keys:\n\n";
uasort($usedKeys, function($a, $b) {
    return count($b) - count($a);
});
$topKeys = array_slice($usedKeys, 0, 20, true);
foreach ($topKeys as $key => $files) {
    $report .= (count($files) < 10 ? ' ' : '') . count($files) . "× `$key`\n";
}
$report .= "\n";

// Missing keys
$report .= "## Missing Translation Keys ⚠️\n\n";
$report .= "These keys are **used in the code** but **not defined** in language files.\n\n";
$report .= "**Total:** " . count($missingKeys) . " keys\n\n";

if (count($missingKeys) > 0) {
    foreach ($missingKeys as $key => $files) {
        $report .= "### `$key`\n\n";
        $report .= "**Used in:**\n";
        foreach (array_unique($files) as $file) {
            $report .= "- `" . $file . "`\n";
        }
        $report .= "\n";
    }
} else {
    $report .= "✅ **No missing keys!** All used keys are properly defined.\n\n";
}

// Unused keys (grouped by file)
$report .= "## Unused Translation Keys 🔍\n\n";
$report .= "These keys are **defined** in language files but **never used** in the codebase.\n\n";
$report .= "**Total:** " . count($unusedKeys) . " keys (" . round(count($unusedKeys) / count($definedKeys) * 100, 1) . "% of defined keys)\n\n";

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

    // Sort by count (most unused first)
    uasort($groupedUnused, function($a, $b) {
        return count($b) - count($a);
    });

    foreach ($groupedUnused as $file => $keys) {
        $report .= "### `$file.php` (" . count($keys) . " unused keys)\n\n";
        $report .= "<details>\n<summary>Click to expand</summary>\n\n```php\n";
        $report .= implode("\n", array_slice($keys, 0, 50)); // Limit to first 50
        if (count($keys) > 50) {
            $report .= "\n... and " . (count($keys) - 50) . " more";
        }
        $report .= "\n```\n\n</details>\n\n";
    }
} else {
    $report .= "✅ **No unused keys!** Excellent translation hygiene.\n\n";
}

// Duplicate patterns
$report .= "## Duplicate/Overlapping Key Patterns 🔀\n\n";
$report .= "These key patterns appear in multiple translation files:\n\n";

if (count($duplicates) > 0) {
    foreach ($duplicates as $baseKey => $occurrences) {
        $report .= "### `$baseKey`\n\n";
        foreach ($occurrences as $occurrence) {
            $report .= "- `$occurrence`\n";
        }
        $report .= "\n";
    }
} else {
    $report .= "✅ **No duplicate patterns found.**\n\n";
}

// Coverage by file
$report .= "## Translation Coverage by File\n\n";
$report .= "| File | Defined | Used | Unused | Coverage |\n";
$report .= "|------|---------|------|--------|----------|\n";

$coverageStats = [];
foreach ($definedKeys as $key) {
    $parts = explode('.', $key);
    $file = $parts[0];
    if (!isset($coverageStats[$file])) {
        $coverageStats[$file] = ['defined' => 0, 'used' => 0, 'unused' => 0];
    }
    $coverageStats[$file]['defined']++;
    if (in_array($key, $unusedKeys)) {
        $coverageStats[$file]['unused']++;
    } else {
        $coverageStats[$file]['used']++;
    }
}

arsort($coverageStats);
foreach ($coverageStats as $file => $stats) {
    $coverage = round(($stats['used'] / $stats['defined']) * 100, 1);
    $report .= "| `$file.php` | " . $stats['defined'] . " | " . $stats['used'] . " | " . $stats['unused'] . " | " . $coverage . "% |\n";
}
$report .= "\n";

// Recommendations
$report .= "## Recommendations 💡\n\n";

$recommendations = [];

if (count($missingKeys) > 0) {
    $recommendations[] = "### 🔴 High Priority: Add Missing Keys\n\n";
    $recommendations[] = "- Add the " . count($missingKeys) . " missing translation keys to prevent runtime errors\n";
    $recommendations[] = "- Focus on keys used in user-facing components first\n";
    $recommendations[] = "- Test all pages in both French and English after adding keys\n\n";
}

if (count($unusedKeys) > 100) {
    $recommendations[] = "### 🟡 Medium Priority: Remove Unused Keys\n\n";
    $recommendations[] = "- **" . count($unusedKeys) . " unused keys** (" . round(count($unusedKeys) / count($definedKeys) * 100, 1) . "% of total) are bloating your translation files\n";
    $recommendations[] = "- Consider removing unused keys to reduce maintenance overhead\n";
    $recommendations[] = "- Some keys may be used dynamically - verify before removing\n";
    $recommendations[] = "- Create a backup before bulk deletion\n\n";
} elseif (count($unusedKeys) > 0) {
    $recommendations[] = "### 🟢 Low Priority: Review Unused Keys\n\n";
    $recommendations[] = "- " . count($unusedKeys) . " unused keys found - relatively low number\n";
    $recommendations[] = "- Review periodically to keep translation files clean\n\n";
} else {
    $recommendations[] = "### ✅ Excellent: No Unused Keys\n\n";
    $recommendations[] = "- All defined keys are being used - perfect translation hygiene!\n\n";
}

$recommendations[] = "### 📋 General Best Practices\n\n";
$recommendations[] = "1. **Consistency**: Follow the existing naming pattern (`file.category.key`)\n";
$recommendations[] = "2. **Documentation**: Document dynamic key construction patterns\n";
$recommendations[] = "3. **Testing**: Test all UI flows in different languages\n";
$recommendations[] = "4. **Automation**: Consider adding translation key validation to CI/CD\n";
$recommendations[] = "5. **Cleanup**: Run this audit quarterly to maintain translation health\n\n";

$report .= implode("", $recommendations);

$report .= "---\n\n";
$report .= "*This report was generated by the automated translation audit script.*\n";

file_put_contents("$baseDir/translation_audit_report.md", $report);
echo "Report saved: translation_audit_report.md\n";

// Save simple lists
file_put_contents(
    "$baseDir/translation_used_keys.txt",
    "=== USED TRANSLATION KEYS ===\n\n" .
    "Total: " . count($usedKeys) . " keys\n\n" .
    implode("\n", array_keys($usedKeys))
);
echo "Used keys saved: translation_used_keys.txt\n";

file_put_contents(
    "$baseDir/translation_defined_keys.txt",
    "=== DEFINED TRANSLATION KEYS ===\n\n" .
    "Total: " . count($definedKeys) . " keys\n\n" .
    implode("\n", $definedKeys)
);
echo "Defined keys saved: translation_defined_keys.txt\n";

// Save unused keys separately for easier reference
file_put_contents(
    "$baseDir/translation_unused_keys.txt",
    "=== UNUSED TRANSLATION KEYS ===\n\n" .
    "Total: " . count($unusedKeys) . " keys\n\n" .
    "These keys are defined but never used in the codebase.\n\n" .
    implode("\n", $unusedKeys)
);
echo "Unused keys saved: translation_unused_keys.txt\n";

// Save missing keys separately
$missingContent = "=== MISSING TRANSLATION KEYS ===\n\n";
$missingContent .= "Total: " . count($missingKeys) . " keys\n\n";
$missingContent .= "These keys are used in the code but not defined in language files.\n\n";
foreach ($missingKeys as $key => $files) {
    $missingContent .= "\n$key\n";
    $missingContent .= "  Used in: " . implode(", ", array_unique($files)) . "\n";
}
file_put_contents("$baseDir/translation_missing_keys.txt", $missingContent);
echo "Missing keys saved: translation_missing_keys.txt\n";

echo "\n=== Audit Complete ===\n";
echo "\nGenerated files:\n";
echo "  ✓ translation_audit_report.md (detailed report)\n";
echo "  ✓ translation_used_keys.txt\n";
echo "  ✓ translation_defined_keys.txt\n";
echo "  ✓ translation_unused_keys.txt\n";
echo "  ✓ translation_missing_keys.txt\n";
