export function isContentPublished(item: { status?: string; scheduledFor?: string; isPublished?: boolean } | null | undefined): boolean {
  if (!item) return false;
  const status = item.status || (item.isPublished ? 'published' : 'draft');
  if (!['published', 'scheduled'].includes(status)) return false;
  if (status === 'scheduled' && !item.scheduledFor) return false;
  if (item.scheduledFor) {
    const time = Date.parse(item.scheduledFor);
    if (!Number.isFinite(time) || time > Date.now()) return false;
  }
  return true;
}
