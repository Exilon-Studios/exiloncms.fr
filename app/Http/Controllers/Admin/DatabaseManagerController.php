<?php

namespace ExilonCMS\Http\Controllers\Admin;

use ExilonCMS\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class DatabaseManagerController extends Controller
{
    /**
     * Display the database management page.
     */
    public function index()
    {
        $connection = config('database.default');
        $database = config("database.connections.{$connection}.database");

        // Get database info
        $info = [
            'connection' => $connection,
            'database' => $database,
            'driver' => config("database.connections.{$connection}.driver"),
            'size' => $this->getDatabaseSize(),
            'table_count' => count(DB::select("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")),
            'version' => DB::select('SELECT sqlite_version() as version')[0]->version ?? null,
        ];

        // Get list of backups
        $backups = $this->getBackups();

        return Inertia::render('Admin/Database/Index', [
            'info' => $info,
            'backups' => $backups,
        ]);
    }

    /**
     * Get all tables in the database.
     */
    public function tables()
    {
        $tables = DB::select("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name");

        $tableData = [];
        foreach ($tables as $table) {
            $tableName = $table->name;
            $count = DB::table($tableName)->count();
            $tableData[] = [
                'name' => $tableName,
                'rows' => $count,
            ];
        }

        return response()->json($tableData);
    }

    /**
     * Get database size.
     */
    protected function getDatabaseSize()
    {
        $dbPath = database_path('database.sqlite');

        if (file_exists($dbPath)) {
            $size = filesize($dbPath);

            return $this->formatBytes($size);
        }

        return 'N/A';
    }

    /**
     * Format bytes to human readable.
     */
    protected function formatBytes($size, $precision = 2)
    {
        if ($size > 0) {
            $size = (int) $size;
            $base = log($size) / log(1024);
            $suffixes = ['B', 'KB', 'MB', 'GB', 'TB'];

            return round(pow(1024, $base - floor($base)), $precision).' '.$suffixes[floor($base)];
        }

        return '0 B';
    }

    /**
     * Get list of backups.
     */
    protected function getBackups()
    {
        $backupDir = storage_path('app/backups');

        if (! file_exists($backupDir)) {
            return [];
        }

        $files = glob($backupDir.'/*.sqlite');
        $backups = [];

        foreach ($files as $file) {
            $backups[] = [
                'filename' => basename($file),
                'size' => $this->formatBytes(filesize($file)),
                'created_at' => date('Y-m-d H:i:s', filemtime($file)),
            ];
        }

        // Sort by date descending
        usort($backups, function ($a, $b) {
            return strtotime($b['created_at']) - strtotime($a['created_at']);
        });

        return $backups;
    }

    /**
     * Create a backup.
     */
    public function backup(Request $request)
    {
        $request->validate([
            'name' => 'nullable|string|max:255',
        ]);

        $dbPath = database_path('database.sqlite');

        if (! file_exists($dbPath)) {
            return back()->withErrors(['database' => 'Database file not found.']);
        }

        $backupDir = storage_path('app/backups');
        if (! file_exists($backupDir)) {
            mkdir($backupDir, 0755, true);
        }

        $name = $request->input('name', 'backup-'.date('Y-m-d-His'));
        $backupPath = $backupDir.'/'.$name.'.sqlite';

        if (copy($dbPath, $backupPath)) {
            return back()->with('success', 'Backup created successfully!');
        }

        return back()->withErrors(['backup' => 'Failed to create backup.']);
    }

    /**
     * Download a backup.
     */
    public function download($filename)
    {
        $backupPath = storage_path('app/backups/'.$filename);

        if (! file_exists($backupPath)) {
            abort(404, 'Backup not found.');
        }

        return response()->download($backupPath);
    }

    /**
     * Delete a backup.
     */
    public function deleteBackup($filename)
    {
        $backupPath = storage_path('app/backups/'.$filename);

        if (! file_exists($backupPath)) {
            abort(404, 'Backup not found.');
        }

        if (unlink($backupPath)) {
            return back()->with('success', 'Backup deleted successfully!');
        }

        return back()->withErrors(['backup' => 'Failed to delete backup.']);
    }

    /**
     * Restore a backup.
     */
    public function restore(Request $request)
    {
        $request->validate([
            'backup' => 'required|string',
        ]);

        $backupPath = storage_path('app/backups/'.$request->input('backup'));
        $dbPath = database_path('database.sqlite');

        if (! file_exists($backupPath)) {
            return back()->withErrors(['backup' => 'Backup file not found.']);
        }

        // Create a backup of current database before restoring
        $currentBackup = storage_path('app/backups/pre-restore-'.date('Y-m-d-His').'.sqlite');
        if (file_exists($dbPath)) {
            copy($dbPath, $currentBackup);
        }

        // Restore the backup
        if (copy($backupPath, $dbPath)) {
            return back()->with('success', 'Database restored successfully! A backup of the previous state was saved.');
        }

        return back()->withErrors(['backup' => 'Failed to restore backup.']);
    }

    /**
     * Export database as SQL.
     */
    public function export()
    {
        $tables = DB::select("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name");

        $sql = "-- ExilonCMS Database Export\n";
        $sql .= '-- Generated: '.date('Y-m-d H:i:s')."\n";
        $sql .= '-- Database: '.config('database.connections.sqlite.database')."\n\n";

        foreach ($tables as $table) {
            $tableName = $table->name;
            $sql .= "-- Table: {$tableName}\n";

            // Get CREATE TABLE statement
            $createTable = DB::select("SELECT sql FROM sqlite_master WHERE type='table' AND name = ?", [$tableName]);
            if (! empty($createTable)) {
                $sql .= $createTable[0]->sql.";\n";
            }

            // Get table data
            $rows = DB::table($tableName)->get();

            if ($rows->isEmpty()) {
                $sql .= "\n";

                continue;
            }

            foreach ($rows as $row) {
                $columns = [];
                $values = [];
                foreach ($row as $column => $value) {
                    $columns[] = $column;
                    if ($value === null) {
                        $values[] = 'NULL';
                    } elseif (is_bool($value)) {
                        $values[] = $value ? '1' : '0';
                    } elseif (is_numeric($value)) {
                        $values[] = $value;
                    } else {
                        $values[] = "'".str_replace("'", "''", $value)."'";
                    }
                }

                $sql .= "INSERT INTO `{$tableName}` (`".implode('`, `', $columns).'`) VALUES ('.implode(', ', $values).");\n";
            }

            $sql .= "\n";
        }

        $filename = 'exiloncms-export-'.date('Y-m-d-His').'.sql';

        return response()->streamDownload(function () use ($sql) {
            echo $sql;
        }, $filename, [
            'Content-Type' => 'text/sql',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
        ]);
    }

    /**
     * Export database as SQLite file.
     */
    public function exportSqlite()
    {
        $dbPath = database_path('database.sqlite');

        if (! file_exists($dbPath)) {
            abort(404, 'Database file not found.');
        }

        $filename = 'exiloncms-database-'.date('Y-m-d-His').'.sqlite';

        return response()->download($dbPath, $filename);
    }

    /**
     * Import SQL file.
     */
    public function import(Request $request)
    {
        $request->validate([
            'sql_file' => 'required|file|mimetypes:text/plain,application/sql',
        ]);

        $file = $request->file('sql_file');
        $sql = file_get_contents($file->getRealPath());

        try {
            // Split SQL statements
            $statements = array_filter(array_map('trim', explode(';', $sql)));

            DB::beginTransaction();

            foreach ($statements as $statement) {
                // Skip comments and empty lines
                if (empty($statement) || str_starts_with($statement, '--')) {
                    continue;
                }

                DB::statement($statement);
            }

            DB::commit();

            return back()->with('success', 'SQL file imported successfully!');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->withErrors(['import' => 'Failed to import SQL file: '.$e->getMessage()]);
        }
    }

    /**
     * Optimize database.
     */
    public function optimize()
    {
        try {
            DB::statement('VACUUM');
            DB::statement('ANALYZE');

            return back()->with('success', 'Database optimized successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['optimize' => 'Failed to optimize database: '.$e->getMessage()]);
        }
    }

    /**
     * Truncate all tables (reset database).
     */
    public function truncate(Request $request)
    {
        $request->validate([
            'confirm' => 'required|accepted',
        ]);

        try {
            $tables = DB::select("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");

            DB::beginTransaction();

            // Disable foreign key constraints
            DB::statement('PRAGMA foreign_keys = OFF');

            foreach ($tables as $table) {
                DB::table($table->name)->truncate();
            }

            // Re-enable foreign key constraints
            DB::statement('PRAGMA foreign_keys = ON');

            DB::commit();

            return back()->with('success', 'All tables truncated successfully!');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->withErrors(['truncate' => 'Failed to truncate tables: '.$e->getMessage()]);
        }
    }
}
