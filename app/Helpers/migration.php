<?php

use Illuminate\Support\Facades\Schema;

/**
 * Check if a table exists and has data before dropping
 * Returns false if table has data to prevent accidental data loss
 */
if (! function_exists('safe_drop_if_exists')) {
    function safe_drop_if_exists(string $tableName): bool
    {
        if (! Schema::hasTable($tableName)) {
            return true; // Table doesn't exist, safe to proceed
        }

        // Table exists - check if it has data
        try {
            $count = DB::table($tableName)->count();

            if ($count > 0) {
                // Log warning
                \Log::warning("Migration attempted to drop table '{$tableName}' with {$count} records. Skipping drop to prevent data loss.", [
                    'table' => $tableName,
                    'records' => $count,
                    'migration' => debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 2)[0]['file'] ?? 'unknown',
                ]);

                // In development, throw exception to catch issues early
                if (config('app.env') !== 'production') {
                    throw new Exception("Cannot drop table '{$tableName}' - it contains {$count} records. Use a proper migration strategy instead.");
                }

                return false; // Don't drop the table
            }

            return true; // Table is empty, safe to drop
        } catch (\Exception $e) {
            // If we can't count, err on the side of caution
            \Log::error("Failed to check table '{$tableName}' for data. Skipping drop for safety.", [
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }
}

/**
 * Safe schema modification - only adds/removes columns without dropping tables
 */
if (! function_exists('safe_modify_table')) {
    function safe_modify_table(string $tableName, callable $callback): void
    {
        if (! Schema::hasTable($tableName)) {
            // Table doesn't exist, create it from scratch
            Schema::create($tableName, $callback);

            return;
        }

        // Table exists - modify it safely
        Schema::table($tableName, $callback);
    }
}
