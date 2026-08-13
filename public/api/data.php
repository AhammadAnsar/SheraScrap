<?php
// Enable output buffering with Gzip compression for high Pingdom & PageSpeed scores
if (!ob_start("ob_gzhandler")) {
    ob_start();
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Handle CORS preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$dataFile = __DIR__ . '/cms_data.json';

// GET Method: Fetch current saved CMS data from Hostinger server
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($dataFile)) {
        $content = file_get_contents($dataFile);
        if ($content !== false && !empty(trim($content))) {
            echo $content;
            exit();
        }
    }
    // Return empty state if no saved server file exists yet
    echo json_encode([
        "status" => "empty",
        "message" => "No saved server data file found. Frontend will use initial defaults."
    ]);
    exit();
}

// POST Method: Save new CMS data to Hostinger server disk
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    if (!$rawInput) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "No data payload received"]);
        exit();
    }

    $decoded = json_decode($rawInput, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Invalid JSON payload"]);
        exit();
    }

    // Save formatted JSON to cms_data.json on server
    $saved = file_put_contents($dataFile, json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    // Automatically generate updated dynamic sitemap.xml
    $sitemapPath1 = __DIR__ . '/../sitemap.xml';
    $sitemapPath2 = __DIR__ . '/../../public/sitemap.xml';
    
    $baseUrl = rtrim($decoded['settings']['siteUrl'] ?? 'https://shera-scrap-haraj.com', '/');
    $today = date('Y-m-d');
    
    $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
    
    // Homepage
    $xml .= "  <url>\n    <loc>" . htmlspecialchars($baseUrl) . "/</loc>\n    <lastmod>{$today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n";
    
    // Main Sections
    $sections = ['#services' => '0.9', '#estimator' => '0.9', '#faq' => '0.8', '#contact' => '0.9'];
    foreach ($sections as $sec => $pri) {
        $xml .= "  <url>\n    <loc>" . htmlspecialchars($baseUrl . '/' . $sec) . "</loc>\n    <lastmod>{$today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>{$pri}</priority>\n  </url>\n";
    }
    
    // Categories / Scrap Services
    if (isset($decoded['categories']) && is_array($decoded['categories'])) {
        foreach ($decoded['categories'] as $cat) {
            $slug = $cat['slug'] ?? $cat['id'] ?? 'scrap';
            $xml .= "  <url>\n    <loc>" . htmlspecialchars($baseUrl . '/#service-' . $slug) . "</loc>\n    <lastmod>{$today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n";
        }
    }
    
    // Published Blog Articles
    if (isset($decoded['posts']) && is_array($decoded['posts'])) {
        foreach ($decoded['posts'] as $post) {
            if (isset($post['status']) && $post['status'] === 'published') {
                $slug = $post['slug'] ?? ('post-' . ($post['id'] ?? '1'));
                $mod = $post['date'] ?? $today;
                $xml .= "  <url>\n    <loc>" . htmlspecialchars($baseUrl . '/#post-' . $slug) . "</loc>\n    <lastmod>{$mod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n";
            }
        }
    }
    
    // Pages
    if (isset($decoded['pages']) && is_array($decoded['pages'])) {
        foreach ($decoded['pages'] as $page) {
            if (!empty($page['isPublished'])) {
                $slug = $page['slug'] ?? ('page-' . ($page['id'] ?? '1'));
                $xml .= "  <url>\n    <loc>" . htmlspecialchars($baseUrl . '/#page-' . $slug) . "</loc>\n    <lastmod>{$today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n";
            }
        }
    }
    
    $xml .= '</urlset>';

    @file_put_contents($sitemapPath1, $xml);
    @file_put_contents($sitemapPath2, $xml);

    if ($saved !== false) {
        echo json_encode([
            "status" => "success", 
            "message" => "CMS Data & Dynamic Sitemap.xml updated successfully on Hostinger server",
            "bytes" => $saved
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "status" => "error", 
            "message" => "Failed to write data to server disk. Check folder write permissions."
        ]);
    }
    exit();
}

http_response_code(405);
echo json_encode(["status" => "error", "message" => "Method not allowed"]);
