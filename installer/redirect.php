<?php
/**
 * Temporary redirect file - Redirects to the ExilonCMS installation
 *
 * IMPORTANT: Configure your Document Root to point to exiloncms/public
 * This file is only for temporary access after installation.
 */

$target = dirname($_SERVER['SCRIPT_NAME']) . '/exiloncms/public';

// Remove trailing slash from target if present
$target = rtrim($target, '/');

// Get the request URI
$requestUri = $_SERVER['REQUEST_URI'] ?? '';

// Get the path without the query string
$path = parse_url($requestUri, PHP_URL_PATH) ?: '';

// Build the target URL
$url = $target . $path;

// Add query string if present
$query = parse_url($requestUri, PHP_URL_QUERY);
if ($query) {
    $url .= '?' . $query;
}

// Redirect
header('Location: ' . $url, true, 302);
exit;
