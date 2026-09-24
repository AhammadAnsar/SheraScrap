const http = require('http');

const PORT = 3000;

function fetchUrl(path) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: PORT,
      path: path,
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml',
      },
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          location: res.headers.location,
          body,
        });
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  console.log('===============================================================');
  console.log('  SHERA SCRAP PHASE 5: LEGACY URL & REDIRECT MIGRATION TESTS');
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;

  async function testRedirect(fromPath, expectedStatus, expectedLocation, label) {
    const res = await fetchUrl(fromPath);
    const statusMatch = res.statusCode === expectedStatus;
    const locationMatch = res.location === expectedLocation;

    if (statusMatch && locationMatch) {
      // Now verify that the target location returns HTTP 200 (Zero Redirect Chain!)
      const targetRes = await fetchUrl(expectedLocation);
      if (targetRes.statusCode === 200) {
        console.log(`[PASS] ${label}: ${fromPath} -> ${expectedStatus} ${expectedLocation} (Terminal HTTP 200 in 1 HOP)`);
        passed++;
        return;
      } else {
        console.error(`[FAIL] ${label}: Target ${expectedLocation} returned ${targetRes.statusCode} instead of 200 (CHAIN OR LOOP DETECTED)`);
        failed++;
        return;
      }
    }

    console.error(`[FAIL] ${label}: ${fromPath} returned ${res.statusCode} (expected ${expectedStatus}), Location: ${res.location} (expected ${expectedLocation})`);
    failed++;
  }

  async function test404(path, label) {
    const res = await fetchUrl(path);
    if (res.statusCode === 404 && res.body.includes('404')) {
      console.log(`[PASS] ${label}: ${path} correctly returned real HTTP 404 (No mass-redirect to home)`);
      passed++;
    } else {
      console.error(`[FAIL] ${label}: ${path} returned ${res.statusCode} instead of 404`);
      failed++;
    }
  }

  try {
    // 1. Root redirect (302 temporary for language negotiation)
    await testRedirect('/', 302, '/ar/', 'Root Homepage');

    // 2. Trailing slash enforcement on canonical language routes
    await testRedirect('/ar/about', 301, '/ar/about/', 'Trailing Slash /ar/about');
    await testRedirect('/ar/contact', 301, '/ar/contact/', 'Trailing Slash /ar/contact');
    await testRedirect('/ar/services', 301, '/ar/services/', 'Trailing Slash /ar/services');
    await testRedirect('/ar/locations', 301, '/ar/locations/', 'Trailing Slash /ar/locations');
    await testRedirect('/ar/blog', 301, '/ar/blog/', 'Trailing Slash /ar/blog');
    await testRedirect('/ar/estimator', 301, '/ar/estimator/', 'Trailing Slash /ar/estimator');
    await testRedirect('/en/about', 301, '/en/about/', 'Trailing Slash /en/about');
    await testRedirect('/en/services', 301, '/en/services/', 'Trailing Slash /en/services');

    // 3. Exact Historical / Legacy Routes (Both with and without trailing slash)
    await testRedirect('/about', 301, '/ar/about/', 'Legacy /about (No Slash)');
    await testRedirect('/about/', 301, '/ar/about/', 'Legacy /about/ (With Slash)');
    await testRedirect('/contact', 301, '/ar/contact/', 'Legacy /contact (No Slash)');
    await testRedirect('/contact/', 301, '/ar/contact/', 'Legacy /contact/ (With Slash)');
    await testRedirect('/services', 301, '/ar/services/', 'Legacy /services (No Slash)');
    await testRedirect('/services/', 301, '/ar/services/', 'Legacy /services/ (With Slash)');
    await testRedirect('/locations', 301, '/ar/locations/', 'Legacy /locations (No Slash)');
    await testRedirect('/locations/', 301, '/ar/locations/', 'Legacy /locations/ (With Slash)');
    await testRedirect('/blog', 301, '/ar/blog/', 'Legacy /blog (No Slash)');
    await testRedirect('/blog/', 301, '/ar/blog/', 'Legacy /blog/ (With Slash)');
    await testRedirect('/article', 301, '/ar/blog/', 'Legacy /article (No Slash)');
    await testRedirect('/article/', 301, '/ar/blog/', 'Legacy /article/ (With Slash)');
    await testRedirect('/articles', 301, '/ar/blog/', 'Legacy /articles (No Slash)');
    await testRedirect('/articles/', 301, '/ar/blog/', 'Legacy /articles/ (With Slash)');
    await testRedirect('/estimator', 301, '/ar/estimator/', 'Legacy /estimator');
    await testRedirect('/faq', 301, '/ar/faq/', 'Legacy /faq');

    // 4. Dynamic Historical Patterns
    await testRedirect('/category/copper', 301, '/ar/services/copper/', 'Legacy /category/copper');
    await testRedirect('/category/copper/', 301, '/ar/services/copper/', 'Legacy /category/copper/');
    await testRedirect('/categories/copper/', 301, '/ar/services/copper/', 'Legacy /categories/copper/');
    await testRedirect('/services/copper', 301, '/ar/services/copper/', 'Legacy /services/copper');
    await testRedirect('/services/copper/', 301, '/ar/services/copper/', 'Legacy /services/copper/');
    await testRedirect('/article/how-to-sell-scrap-dammam-best-price', 301, '/ar/blog/how-to-sell-scrap-dammam-best-price/', 'Legacy /article/slug');
    await testRedirect('/article/how-to-sell-scrap-dammam-best-price/', 301, '/ar/blog/how-to-sell-scrap-dammam-best-price/', 'Legacy /article/slug/');
    await testRedirect('/articles/how-to-sell-scrap-dammam-best-price/', 301, '/ar/blog/how-to-sell-scrap-dammam-best-price/', 'Legacy /articles/slug/');
    await testRedirect('/post/how-to-sell-scrap-dammam-best-price/', 301, '/ar/blog/how-to-sell-scrap-dammam-best-price/', 'Legacy /post/slug/');
    await testRedirect('/posts/how-to-sell-scrap-dammam-best-price/', 301, '/ar/blog/how-to-sell-scrap-dammam-best-price/', 'Legacy /posts/slug/');
    await testRedirect('/blog/how-to-sell-scrap-dammam-best-price', 301, '/ar/blog/how-to-sell-scrap-dammam-best-price/', 'Legacy /blog/slug');
    await testRedirect('/locations/restaurant-equipment-dammam', 301, '/ar/locations/restaurant-equipment-dammam/', 'Legacy /locations/slug');
    await testRedirect('/location/restaurant-equipment-dammam/', 301, '/ar/locations/restaurant-equipment-dammam/', 'Legacy /location/slug');

    // 5. Legacy ID Resolution
    await testRedirect('/article/post-1', 301, '/ar/blog/how-to-sell-scrap-dammam-best-price/', 'Legacy ID /article/post-1');
    await testRedirect('/article/post-1/', 301, '/ar/blog/how-to-sell-scrap-dammam-best-price/', 'Legacy ID /article/post-1/');
    await testRedirect('/post/post-2/', 301, '/ar/blog/used-ac-buying-dammam-guide/', 'Legacy ID /post/post-2/');
    await testRedirect('/post-post-1', 301, '/ar/blog/how-to-sell-scrap-dammam-best-price/', 'Legacy hash-path /post-post-1');
    await testRedirect('/service-copper', 301, '/ar/services/copper/', 'Legacy hash-path /service-copper');

    // 6. Managed CMS Redirects from store.json
    await testRedirect('/old-scrap-rates', 301, '/ar/estimator/', 'CMS Managed /old-scrap-rates');
    await testRedirect('/old-scrap-rates/', 301, '/ar/estimator/', 'CMS Managed /old-scrap-rates/');
    await testRedirect('/contact-us-old', 301, '/ar/contact/', 'CMS Managed /contact-us-old');
    await testRedirect('/about-us-old', 301, '/ar/about/', 'CMS Managed /about-us-old');

    // 7. Prevent Mass-Redirecting Missing Pages to Homepage (HTTP 404 policy)
    await test404('/ar/this-page-does-not-exist-xyz-98765/', 'Missing Arabic subpage');
    await test404('/en/completely-missing-page-404-test/', 'Missing English subpage');
    await test404('/non-existent-arbitrary-directory/', 'Arbitrary missing path');
    await test404('/services/non-existent-service-slug-xyz/', 'Missing service slug');

    console.log('\n===============================================================');
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('===============================================================');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runTests();
