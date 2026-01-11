<?php

if (defined('EXILONCMS_NO_URL_REWRITE')) {
    exit('An error occurred, please try to refresh the page.');
}

define('EXILONCMS_NO_URL_REWRITE', 'true');

require __DIR__.'/public/index.php';
