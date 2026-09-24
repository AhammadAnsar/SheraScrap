// Automated Security Hardening & Threat Model Test Suite for Shera Scrap CMS
// Tests the "Dirty Dozen" attack vectors and authorized workflows against server routes

const http = require('http');

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : null;
          resolve({ status: res.statusCode, headers: res.headers, data: parsed, raw: body });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: body });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('===============================================================');
  console.log('  SHERA SCRAP SECURITY VERIFICATION: DIRTY DOZEN TEST SUITE');
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(name, condition, details = '') {
    if (condition) {
      console.log(`[PASS] ${name}`);
      passed++;
    } else {
      console.error(`[FAIL] ${name} — ${details}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------------------
    // Attack 01: Privilege Escalation on User Profile
    // -------------------------------------------------------------------------
    const res1 = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/admin/users',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, {
      id: 'usr-attacker',
      username: 'attacker',
      role: 'super_admin',
      email: 'attacker@evil.com'
    });
    assert(
      'Attack 01: Unauthenticated Privilege Escalation on User Profile Rejected',
      res1.status === 401 || res1.status === 403,
      `Expected 401/403, got ${res1.status}`
    );

    // -------------------------------------------------------------------------
    // Attack 02: Unauthorized Inquiry Scraping
    // -------------------------------------------------------------------------
    const res2 = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/inquiries',
      method: 'GET',
    });
    assert(
      'Attack 02: Unauthenticated Inquiry Scraping Prohibited',
      res2.status === 401 || res2.status === 403,
      `Expected 401/403, got ${res2.status}`
    );

    // -------------------------------------------------------------------------
    // Attack 03: Shadow Update Injection in Post
    // -------------------------------------------------------------------------
    const res3 = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/cms/posts',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, {
      id: 'post-hacked',
      titleAr: 'اختراق وهمي',
      systemAdminOverride: true
    });
    assert(
      'Attack 03: Unauthenticated Post Creation/Injection Rejected',
      res3.status === 401 || res3.status === 403,
      `Expected 401/403, got ${res3.status}`
    );

    // -------------------------------------------------------------------------
    // Attack 04: Public Infiltration into User Directory
    // -------------------------------------------------------------------------
    const res4Users = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/admin/users',
      method: 'GET',
    });
    const res4Entities = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/cms/entities',
      method: 'GET',
    });
    assert(
      'Attack 04: Direct User Directory Access Denied & Not Leaked in Public Entities',
      (res4Users.status === 401 || res4Users.status === 403) && !res4Entities.data?.users,
      `res4Users status: ${res4Users.status}, users in public entities: ${!!res4Entities.data?.users}`
    );

    // -------------------------------------------------------------------------
    // Attack 05: Tampering with Audit Logs
    // -------------------------------------------------------------------------
    const res5 = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/cms/audit-logs',
      method: 'GET',
    });
    assert(
      'Attack 05: Unauthenticated Access to Audit Logs Denied',
      res5.status === 401 || res5.status === 403,
      `Expected 401/403, got ${res5.status}`
    );

    // -------------------------------------------------------------------------
    // Attack 06: Unauthorized Site Settings Mutation
    // -------------------------------------------------------------------------
    const res6 = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/cms/settings',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, {
      siteUrl: 'https://phishing-scam.com',
      phone: '0599999999'
    });
    assert(
      'Attack 06: Unauthorized Site Settings Mutation Denied',
      res6.status === 401 || res6.status === 403,
      `Expected 401/403, got ${res6.status}`
    );

    // -------------------------------------------------------------------------
    // Attack 07: Unauthenticated Media Deletion
    // -------------------------------------------------------------------------
    const res7 = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/media/logo.png',
      method: 'DELETE',
    });
    assert(
      'Attack 07: Unauthenticated Media Deletion Denied',
      res7.status === 401 || res7.status === 403,
      `Expected 401/403, got ${res7.status}`
    );

    // -------------------------------------------------------------------------
    // Attack 08: Direct Publication by Unauthenticated / Author
    // -------------------------------------------------------------------------
    const res8 = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/cms/posts',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, {
      id: 'post-draft-99',
      status: 'published',
      isPublished: true
    });
    assert(
      'Attack 08: Unauthenticated / Unauthorized Direct Post Publication Denied',
      res8.status === 401 || res8.status === 403,
      `Expected 401/403, got ${res8.status}`
    );

    // -------------------------------------------------------------------------
    // Attack 09: Huge Payload Denial of Wallet Attack on Inquiries
    // -------------------------------------------------------------------------
    const hugeName = 'A'.repeat(500); // Exceeds 200 limit
    const res9 = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/inquiries',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, {
      name: hugeName,
      phone: '0500000000'
    });
    assert(
      'Attack 09: Oversized Payload Rejected with 400 Bad Request',
      res9.status === 400,
      `Expected 400, got ${res9.status}`
    );

    // -------------------------------------------------------------------------
    // Attack 10: Infiltration into Admin Roles
    // -------------------------------------------------------------------------
    const res10 = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/admin/roles',
      method: 'GET',
    });
    assert(
      'Attack 10: Unauthenticated Roles Query Denied',
      res10.status === 401 || res10.status === 403,
      `Expected 401/403, got ${res10.status}`
    );

    // -------------------------------------------------------------------------
    // Attack 11: Draft Post Data Leakage
    // -------------------------------------------------------------------------
    const res11 = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/cms/entities',
      method: 'GET',
    });
    const publicPosts = res11.data?.posts || [];
    const hasDrafts = publicPosts.some((p) => p.status !== 'published');
    assert(
      'Attack 11: Draft Post Data Leakage Prevented (Public Only Receives Published)',
      !hasDrafts && publicPosts.length > 0,
      `Drafts found: ${hasDrafts}, Total posts: ${publicPosts.length}`
    );

    // -------------------------------------------------------------------------
    // Attack 12: Malicious Redirect Injection
    // -------------------------------------------------------------------------
    const res12 = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/cms/redirects',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, {
      fromUrl: '/ar/',
      toUrl: 'https://malicious-site.com',
      type: '301',
      active: true
    });
    assert(
      'Attack 12: Malicious Redirect Injection Denied',
      res12.status === 401 || res12.status === 403,
      `Expected 401/403, got ${res12.status}`
    );

    // -------------------------------------------------------------------------
    // AUTHORIZED OPERATIONS
    // -------------------------------------------------------------------------
    console.log('\n--- VERIFYING LEGITIMATE AUTHORIZED OPERATIONS ---');

    // 1. Health check
    const resHealth = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/health',
      method: 'GET',
    });
    assert('Authorized: Health Check Accessible', resHealth.status === 200 && resHealth.data?.status === 'ok');

    // 2. Public CMS Entities
    assert(
      'Authorized: Public CMS Entities Loaded without Leaking Private Collections',
      res11.status === 200 &&
      Array.isArray(res11.data?.posts) &&
      Array.isArray(res11.data?.services) &&
      Array.isArray(res11.data?.locations) &&
      !res11.data?.inquiries &&
      !res11.data?.auditLogs &&
      !res11.data?.users
    );

    // 3. Legitimate Public Inquiry Creation
    const resInquiry = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/inquiries',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, {
      name: 'أحمد السعيد (عميل اختبار)',
      phone: '0551234567',
      location: 'الدمام - حي الخالدية',
      materialType: 'حديد وألمنيوم'
    });
    assert(
      'Authorized: Legitimate Customer Inquiry Submitted Successfully',
      resInquiry.status === 200 && resInquiry.data?.success === true && resInquiry.data?.inquiry?.id
    );

    // 4. Public Media List
    const resMedia = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/media',
      method: 'GET',
    });
    assert('Authorized: Public Media Assets List Accessible', resMedia.status === 200 && Array.isArray(resMedia.data?.media));

    console.log('\n===============================================================');
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('===============================================================');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test execution failed:', err);
    process.exit(1);
  }
}

runTests();
