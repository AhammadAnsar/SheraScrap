<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight CORS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$uploadsDir = __DIR__ . '/../uploads/';

// Ensure /uploads/ folder exists on Hostinger
if (!file_exists($uploadsDir)) {
    @mkdir($uploadsDir, 0755, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $uploadedUrl = null;
    $fileName = null;
    $fileSize = 0;

    // Option 1: Direct Multipart Form File Upload
    if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
        $tmpName = $_FILES['file']['tmp_name'];
        $originalName = $_FILES['file']['name'];
        $ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
        
        $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico'];
        if (!in_array($ext, $allowed)) {
            $ext = 'jpg';
        }

        $cleanBaseName = preg_replace('/[^a-zA-Z0-9_\-]/', '_', pathinfo($originalName, PATHINFO_FILENAME));
        $fileName = 'media_' . date('Ymd_His') . '_' . substr(md5(uniqid()), 0, 6) . '.' . $ext;
        $targetPath = $uploadsDir . $fileName;

        if (move_uploaded_file($tmpName, $targetPath)) {
            // Server-side WebP conversion fallback via GD if image is jpg/png
            if (function_exists('imagewebp') && in_array($ext, ['jpg', 'jpeg', 'png'])) {
                $webpFileName = 'media_' . date('Ymd_His') . '_' . substr(md5(uniqid()), 0, 6) . '.webp';
                $webpPath = $uploadsDir . $webpFileName;
                
                $img = null;
                if ($ext === 'jpg' || $ext === 'jpeg') {
                    $img = @imagecreatefromjpeg($targetPath);
                } elseif ($ext === 'png') {
                    $img = @imagecreatefrompng($targetPath);
                    if ($img) {
                        imagealphablending($img, true);
                        imagesavealpha($img, true);
                    }
                }

                if ($img) {
                    if (@imagewebp($img, $webpPath, 85)) {
                        imagedestroy($img);
                        @unlink($targetPath); // Remove original non-webp file
                        $fileName = $webpFileName;
                        $targetPath = $webpPath;
                    } else {
                        imagedestroy($img);
                    }
                }
            }

            $uploadedUrl = '/uploads/' . $fileName;
            $fileSize = filesize($targetPath);
        }
    } 
    // Option 2: JSON Payload with Base64 String
    else {
        $rawInput = file_get_contents('php://input');
        if ($rawInput) {
            $decoded = json_decode($rawInput, true);
            if (isset($decoded['image'])) {
                $base64Data = $decoded['image'];
                $providedName = isset($decoded['name']) ? $decoded['name'] : 'image';

                // Extract mime type and base64 content
                if (preg_match('/^data:image\/(\w+);base64,/', $base64Data, $type)) {
                    $base64Data = substr($base64Data, strpos($base64Data, ',') + 1);
                    $ext = strtolower($type[1]);
                    if ($ext === 'jpeg') $ext = 'jpg';
                } else {
                    $ext = 'jpg';
                }

                $base64Data = base64_decode($base64Data);
                if ($base64Data !== false) {
                    $fileName = 'img_' . date('Ymd_His') . '_' . substr(md5(uniqid()), 0, 6) . '.' . $ext;
                    $targetPath = $uploadsDir . $fileName;

                    if (file_put_contents($targetPath, $base64Data) !== false) {
                        $uploadedUrl = '/uploads/' . $fileName;
                        $fileSize = strlen($base64Data);
                    }
                }
            }
        }
    }

    if ($uploadedUrl) {
        echo json_encode([
            "success" => true,
            "status" => "success",
            "url" => $uploadedUrl,
            "fileName" => $fileName,
            "fileSize" => $fileSize,
            "uploadedAt" => date('c')
        ]);
        exit();
    } else {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "status" => "error",
            "message" => "Failed to save file to /uploads/ folder. Please check directory permissions."
        ]);
        exit();
    }
}

http_response_code(405);
echo json_encode(["status" => "error", "message" => "Method not allowed"]);
