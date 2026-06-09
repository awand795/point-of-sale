<?php

/**
 * Vercel Entry Point for Laravel
 */

// CORS: Set dynamic origin from request (or fallback to *)
$allowedOrigins = [
    'https://pos-bikinsite-8ne4rrepg-awanda-s-projects.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header('Access-Control-Allow-Origin: *');
}
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin');
header('Access-Control-Max-Age: 86400');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Fix Vercel URL routing: Vercel serverless PHP sets PATH_INFO (e.g., /login)
// which causes Laravel/Symfony to use it instead of the full REQUEST_URI.
// This makes the API route /api/login appear as /login, hitting Fortify instead
// of the custom AuthController. We reconstruct the full URI from the script
// directory + PATH_INFO, then remove PATH_INFO so Symfony uses REQUEST_URI.
if (isset($_SERVER['PATH_INFO'])) {
    $prefix = dirname($_SERVER['SCRIPT_NAME']);
    if ($prefix === '.' || $prefix === '\\' || $prefix === '/') {
        $prefix = '';
    }
    $_SERVER['REQUEST_URI'] = $prefix . $_SERVER['PATH_INFO'];
    unset($_SERVER['PATH_INFO']);
}

require __DIR__ . '/../public/index.php';
