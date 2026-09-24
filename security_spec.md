# Security Specification & Threat Model — Shera Scrap CMS

## 1. Data Invariants

1. **Unauthenticated Public Read Boundary**:
   - Public users can ONLY read published posts (`status == 'published'`), published pages (`isPublished == true`), public service items, locations, categories, tags, menus, and sanitized site settings.
   - Public users are strictly forbidden from reading:
     - `users` collection (contains emails, user hashes, and administrative profiles)
     - `auditLogs` collection (system audit logs and sensitive tracking)
     - `inquiries` collection (customer phone numbers, names, locations, and scrap details)
     - `admins` collection (role gates)
     - Draft, scheduled, archived, or trashed posts and pages.

2. **Server-Authoritative RBAC Invariant**:
   - Client tokens cannot self-assign or claim roles (`role: "super_admin"` in client payload is completely ignored and rejected).
   - Only users with verified identities matching `super_admin` or `administrator` can mutate:
     - Global site settings
     - Redirect rules (301/302)
     - User accounts and role assignments
     - Page creation, deletion, and publishing
     - System database migrations
   - `editor` role can:
     - Create, update, publish, and delete blog posts and scrap guides
     - Manage services, scrap categories, tags, and media assets
     - View and update inquiry processing status
   - `author` role can:
     - Create and update their own draft posts (`status == 'draft'`)
     - Upload media for their articles
     - Cannot publish directly, cannot modify site settings, cannot delete others' posts
   - `viewer` role has read-only access to published content.

3. **Customer Inquiries Invariant**:
   - Unauthenticated visitors can create an inquiry (`POST /inquiries`) with strict payload validation (valid name <= 200 chars, phone <= 50 chars).
   - Inquiries cannot be read, listed, modified, or deleted by public users. Only authorized staff (`editor`, `administrator`, `super_admin`) can read or update status.

4. **Immutability of Audit Logs**:
   - Audit logs can only be created by server/admin upon verified mutations.
   - Once created, audit logs can never be modified or deleted (`allow update, delete: if false`).

---

## 2. The "Dirty Dozen" Payloads

The following 12 attack vectors are explicitly tested to guarantee they are denied:

1. **Attack 01: Privilege Escalation on User Profile**:
   An authenticated author attempts to set their own role to `super_admin`:
   ```json
   {
     "id": "usr-attacker",
     "username": "attacker",
     "role": "super_admin",
     "email": "attacker@evil.com"
   }
   ```
   *Expected: PERMISSION_DENIED*

2. **Attack 02: Unauthorized Inquiry Scraping**:
   An unauthenticated or regular visitor attempts a collection query `getDocs(collection(db, 'inquiries'))`:
   *Expected: PERMISSION_DENIED*

3. **Attack 03: Shadow Update Injection in Post**:
   An author attempts to inject administrative shadow fields (`isApprovedByGov: true`, `featuredOnHomepage: true`):
   ```json
   {
     "id": "post-1",
     "titleAr": "تعديل غير مصرح",
     "isApprovedByGov": true,
     "systemAdminOverride": true
   }
   ```
   *Expected: PERMISSION_DENIED*

4. **Attack 04: Public Infiltration into User Directory**:
   Unauthenticated caller attempts `getDoc(doc(db, 'users', 'usr-admin-1'))`:
   *Expected: PERMISSION_DENIED*

5. **Attack 05: Tampering with Audit Logs**:
   An admin attempts an `updateDoc` or `deleteDoc` on `/auditLogs/log-123` to erase tracking evidence:
   *Expected: PERMISSION_DENIED*

6. **Attack 06: Unauthorized Site Settings Mutation**:
   An editor or author attempts to modify global `settings` or canonical domain:
   ```json
   {
     "id": "global_settings",
     "siteUrl": "https://phishing-scam.com",
     "phone": "0599999999"
   }
   ```
   *Expected: PERMISSION_DENIED*

7. **Attack 07: Unauthenticated Media Deletion**:
   An anonymous attacker calls `DELETE /api/media/logo.png` or attempts deleting from `/media`:
   *Expected: PERMISSION_DENIED*

8. **Attack 08: Direct Publication by Author**:
   An author without publish rights attempts to transition a post directly from `draft` to `published`:
   ```json
   {
     "id": "post-draft-99",
     "status": "published",
     "isPublished": true
   }
   ```
   *Expected: PERMISSION_DENIED*

9. **Attack 09: Huge Payload Denial of Wallet Attack**:
   An attacker sends an inquiry with a 2MB string in the `name` field to exhaust database storage:
   ```json
   {
     "name": "A".repeat(2000000),
     "phone": "0500000000"
   }
   ```
   *Expected: PERMISSION_DENIED*

10. **Attack 10: Infiltration into Admin Roles Collection**:
    A regular authenticated user tries to add themselves to `/admins/{uid}`:
    ```json
    {
      "uid": "attacker-uid",
      "role": "super_admin",
      "email": "attacker@evil.com"
    }
    ```
    *Expected: PERMISSION_DENIED*

11. **Attack 11: Draft Post Data Leakage**:
    An unauthenticated visitor queries `/posts` where `status == 'draft'`:
    *Expected: PERMISSION_DENIED*

12. **Attack 12: Redirect Loop / Malicious Redirect Injection**:
    An unauthenticated or author user attempts creating a 301 redirect rule:
    ```json
    {
      "fromUrl": "/ar/",
      "toUrl": "https://malicious-site.com",
      "type": "301",
      "active": true
    }
    ```
    *Expected: PERMISSION_DENIED*

---

## 3. Test Runner Specification

All 12 attacks are verified by the server-side API integration tests and Firestore rule evaluations. Any deviation triggers an immediate 401 Unauthorized or 403 Forbidden.
