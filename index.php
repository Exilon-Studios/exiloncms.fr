<?php

/**
 * ExilonCMS entry point for servers that can't change document root
 * This file forwards traffic to the public/ directory (like Azuriom)
 */

require_once __DIR__.'/public/index.php';
