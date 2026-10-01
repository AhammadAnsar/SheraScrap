/**
 * Centralized Slug Management Service
 * Ensures Unicode, Arabic, and English URL safety, collision detection, and deterministic output.
 */

export function generateSlug(text: string): string {
  if (!text) return "";
  
  return text
    .toString()
    .trim()
    .toLowerCase()
    // Normalize Arabic diacritics / tatweel
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    // Replace Arabic letters with common normalization if needed (alif, etc.)
    .replace(/[إأآا]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    // Replace non-alphanumeric characters (except Arabic letters, English letters, digits, and hyphens)
    .replace(/[^\u0600-\u06FFa-z0-9\-]+/gi, "-")
    // Replace multiple hyphens with single hyphen
    .replace(/-+/g, "-")
    // Remove leading and trailing hyphens
    .replace(/^-+|-+$/g, "");
}

/**
 * Validates that a slug contains only safe URL characters (Arabic letters, a-z, 0-9, and hyphen)
 */
export function isValidSlug(slug: string): boolean {
  if (!slug || slug.length > 200) return false;
  return /^[\u0600-\u06FFa-z0-9]+(?:-[\u0600-\u06FFa-z0-9]+)*$/i.test(slug);
}

/**
 * Ensures a slug is unique within an array of existing slugs.
 * If duplicate, appends -2, -3, etc.
 */
export function ensureUniqueSlug(desiredSlug: string, existingSlugs: string[], currentId?: string): string {
  const base = generateSlug(desiredSlug) || "item";
  let uniqueSlug = base;
  let counter = 2;

  while (existingSlugs.includes(uniqueSlug)) {
    uniqueSlug = `${base}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}
