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
  console.log('  SHERA SCRAP PHASE 4 VERIFICATION: MULTI-PAGE SSR ROUTING');
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // Test 1: Root redirect to /ar/
    const rootRes = await fetchUrl('/');
    assert(
      rootRes.statusCode === 302 && rootRes.headers.location === '/ar/',
      `Root (/) redirects 302 to /ar/ (received: ${rootRes.statusCode}, location: ${rootRes.headers.location})`
    );

    // Test 2: Trailing slash enforcement
    const noSlashRes = await fetchUrl('/ar/about');
    assert(
      noSlashRes.statusCode === 301 && noSlashRes.headers.location === '/ar/about/',
      `/ar/about 301 redirects to /ar/about/ (received: ${noSlashRes.statusCode}, location: ${noSlashRes.headers.location})`
    );

    // Test 3: Representative Arabic Pages SSR & HTTP 200
    const arPages = [
      { path: '/ar/', label: 'Arabic Home', mustContain: ['مؤسسة شيرا', 'https://sherascrap.com/ar/'] },
      { path: '/ar/about/', label: 'Arabic About', mustContain: ['من نحن', 'رؤيتنا ورسالتنا'] },
      { path: '/ar/contact/', label: 'Arabic Contact', mustContain: ['اتصل بنا', '573690164'] },
      { path: '/ar/services/', label: 'Arabic Services Archive', mustContain: ['خدماتنا', 'شراء سكراب'] },
      { path: '/ar/services/copper/', label: 'Arabic Service Single (Copper)', mustContain: ['نحاس', 'طلب تسعير'] },
      { path: '/ar/locations/', label: 'Arabic Locations Archive', mustContain: ['مناطق تغطية', 'الدمام'] },
      { path: '/ar/locations/restaurant-equipment-dammam/', label: 'Arabic Location Single (Restaurant)', mustContain: ['معدات مطاعم', 'الدمام'] },
      { path: '/ar/blog/', label: 'Arabic Blog Archive', mustContain: ['المدونة', 'how-to-sell-scrap-dammam-best-price'] },
      { path: '/ar/blog/how-to-sell-scrap-dammam-best-price/', label: 'Arabic Blog Single', mustContain: ['كيف تبيع السكراب بالدمام بأعلى سعر'] },
    ];

    for (const page of arPages) {
      const res = await fetchUrl(page.path);
      const has200 = res.statusCode === 200;
      const hasContent = page.mustContain.every(term => res.body.includes(term));
      const hasSingleTitle = (res.body.match(/<title>/g) || []).length === 1;
      const hasCanonical = res.body.includes('<link rel="canonical"');
      const hasJsonLd = res.body.includes('application/ld+json');
      const isRtl = res.body.includes('dir="rtl"') && res.body.includes('lang="ar"');

      assert(
        has200 && hasContent && hasSingleTitle && hasCanonical && hasJsonLd && isRtl,
        `${page.label} (${page.path}) rendered SSR HTML (HTTP 200, RTL, valid Title, Canonical & Schema)`
      );
    }

    // Test 4: Representative English Pages SSR & HTTP 200
    const enPages = [
      { path: '/en/', label: 'English Home', mustContain: ['Shera Scrap', 'https://sherascrap.com/en/'] },
      { path: '/en/about/', label: 'English About', mustContain: ['About Us', 'Our Mission'] },
      { path: '/en/contact/', label: 'English Contact', mustContain: ['Contact Us', '573690164'] },
      { path: '/en/services/', label: 'English Services Archive', mustContain: ['Services', 'Dammam'] },
      { path: '/en/services/copper/', label: 'English Service Single (Copper)', mustContain: ['Copper', 'WhatsApp'] },
      { path: '/en/locations/', label: 'English Locations Archive', mustContain: ['Coverage', 'Dammam'] },
      { path: '/en/locations/restaurant-equipment-dammam/', label: 'English Location Single', mustContain: ['Dammam', 'Coverage'] },
      { path: '/en/blog/', label: 'English Blog Archive', mustContain: ['Blog'] },
    ];

    for (const page of enPages) {
      const res = await fetchUrl(page.path);
      const has200 = res.statusCode === 200;
      const hasContent = page.mustContain.every(term => res.body.includes(term));
      const hasSingleTitle = (res.body.match(/<title>/g) || []).length === 1;
      const hasCanonical = res.body.includes('<link rel="canonical"');
      const isLtr = res.body.includes('dir="ltr"') && res.body.includes('lang="en"');

      assert(
        has200 && hasContent && hasSingleTitle && hasCanonical && isLtr,
        `${page.label} (${page.path}) rendered SSR HTML (HTTP 200, LTR, valid Title & Canonical)`
      );
    }

    // Test 5: Real HTTP 404 Status for Missing Routes
    const missingRes = await fetchUrl('/ar/this-page-does-not-exist-12345/');
    assert(
      missingRes.statusCode === 404 && missingRes.body.includes('404') && missingRes.body.includes('noindex'),
      `Missing page returns architectural HTTP 404 status code and noindex tag (received: ${missingRes.statusCode})`
    );

    const invalidPrefixRes = await fetchUrl('/fr/about/');
    assert(
      invalidPrefixRes.statusCode === 404,
      `Unsupported language prefix returns HTTP 404 (received: ${invalidPrefixRes.statusCode})`
    );

    // Test 6: Legacy URL 301 Mappings
    const legacyRes1 = await fetchUrl('/about/');
    assert(
      legacyRes1.statusCode === 301 && legacyRes1.headers.location === '/ar/about/',
      `Legacy /about/ 301 redirects to /ar/about/ (location: ${legacyRes1.headers.location})`
    );

    const legacyRes2 = await fetchUrl('/services/');
    assert(
      legacyRes2.statusCode === 301 && legacyRes2.headers.location === '/ar/services/',
      `Legacy /services/ 301 redirects to /ar/services/ (location: ${legacyRes2.headers.location})`
    );

    const legacyRes3 = await fetchUrl('/category/copper/');
    assert(
      legacyRes3.statusCode === 301 && legacyRes3.headers.location === '/ar/services/copper/',
      `Legacy /category/copper/ 301 redirects to /ar/services/copper/ (location: ${legacyRes3.headers.location})`
    );

    // Test 7: Admin Portal English Backend Shell
    const adminRes = await fetchUrl('/admin/');
    assert(
      adminRes.statusCode === 200 && 
      adminRes.body.includes('lang="en"') && 
      adminRes.body.includes('dir="ltr"') &&
      adminRes.body.includes('noindex'),
      'Admin Portal (/admin/) serves English LTR noindex shell (HTTP 200)'
    );

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
