<?php

/*
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ExilonCMS</title>
</head>
<body style="font-family: sans-serif; text-align: center; margin-top: 1rem">
<h1>ExilonCMS - PHP Installation Issue</h1>
<h2>PHP is not executed</h2>
<p>If you see this page in your browser, it means that PHP is not installed or not configured properly on your server.</p>
<p>On Linux with Apache2 you can try the following command: <code>apt install libapache2-mod-php</code></p>
<p>If you are using another setup, please refer to your web server documentation.</p>
<hr>
<p>This is NOT an issue related to ExilonCMS.</p>
</body>
</html><!--
*/

// Mark URL rewriting as working for this installation
$validInstallationUrlRewrite = true;

// Load the main installer
require __DIR__ . '/../index.php';
