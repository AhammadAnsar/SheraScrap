<?php
if (!ob_start("ob_gzhandler")) {
    ob_start();
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$uploadsDir = __DIR__ . '/../uploads/';

// Ensure folder exists
if (!file_exists($uploadsDir)) {
    @mkdir($uploadsDir, 0755, true);
}

$mediaFiles = [];

if (file_exists($uploadsDir) && is_dir($uploadsDir)) {
    $files = scandir($uploadsDir);
    foreach ($files as $file) {
        if ($file === '.' || $file === '..') continue;

        $filePath = $uploadsDir . $file;
        if (is_file($filePath)) {
            $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            if (in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico'])) {
                $bytes = filesize($filePath);
                $formattedSize = $bytes > 1048576 ? round($bytes / 1048576, 2) . ' MB' : round($bytes / 1024, 1) . ' KB';
                
                $mediaFiles[] = [
                    'id' => md5($file),
                    'url' => '/uploads/' . $file,
                    'title' => $file,
                    'size' => $formattedSize,
                    'mimeType' => 'image/' . $ext,
                    'date' => date('Y-m-d H:i:s', filemtime($filePath))
                ];
            }
        }
    }
}

// Sort newest first
usort($mediaFiles, function($a, $b) {
    return strcmp($b['date'], $a['date']);
});

echo json_encode([
    'status' => 'success',
    'total' => count($mediaFiles),
    'media' => $mediaFiles
], JSON_UNESCAPED_UNICODE);
